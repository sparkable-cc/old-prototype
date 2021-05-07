const { GraphQLLocalStrategy } = require('graphql-passport')
const { PgDb } = require('pogi')
const compression = require('compression')
const connectPgSimple = require('connect-pg-simple')
const express = require('express')
const next = require('next')
const passport = require('passport')
const session = require('express-session')
const throng = require('throng')
const sleep = require('await-sleep')

const grapqhl = require('./apollo/server')

const count = process.env.WEB_CONCURRENCY || 1
const isDev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT, 10) || 3000
const sessionSecret = process.env.SESSION_SECRET || 'Ne partez pas sans moi'
const SessionStore = connectPgSimple(session)

const nextApp = next({ dev: isDev })
const nextAppRequestHandler = nextApp.getRequestHandler()

// const worker = (workerId) => nextApp.prepare()
const workerId = 0
nextApp
  .prepare()
  .then(() =>
    PgDb.connect({
      application_name: [
        'backends',
        process.env.SERVER && `server:${process.env.SERVER}`,
        process.env.DYNO && `dyno:${process.env.DYNO}`,
        workerId && `worker:${workerId}`,
      ]
        .filter(Boolean)
        .join(' '),
      connectionString: process.env.DATABASE_URL,
      max: process.env.DATABASE_MAX_CONNECTIONS,
    }),
  )
  .then(async (pgdb) => {
    const expressApp = express()

    expressApp.disable('x-powered-by')

    /**
     * Compress express served files
     */
    if (!isDev) {
      // Compress express served files
      expressApp.use(compression())

      // Trust proxy
      expressApp.set('trust proxy', 1)

      // Force SSL Redirect
      expressApp.use(function (req, res, next) {
        if (
          process.env.NODE_ENV === 'production' &&
          req.headers['x-forwarded-proto'] !== 'https'
        ) {
          return res.redirect(['https://', req.hostname, req.url].join(''))
        }

        return next()
      })
    }

    expressApp.use(express.static('public'))
    expressApp.use('/_next/static', express.static('.next/static'))

    /**
     * Session
     */
    expressApp.use(
      '/graphql',
      session({
        store: new SessionStore({
          pool: pgdb.pool,
          tableName: 'sessions',
        }),
        name: 'dion',
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        rolling: false,
        cookie: {
          httpOnly: true,
          secure: !isDev,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          sameSite: true,
        },
      }),
    )

    /**
     * Passport
     */
    passport.use(
      new GraphQLLocalStrategy(async (codeDirty = '', name, done) => {
        const code = codeDirty.replace(/[^A-Za-z0-9]+/g, '')

        try {
          const user = await pgdb.public.users.findOne({
            code
          })
          if (!user) {
            throw new Error('account not found')
          }

          const updatedUsers = await pgdb.public.users.updateAndGetOne(
            { id: user.id },
            { name }
          )

          // @TODO: Log-Entry -> Login

          console.log(
            'passport:ok',
            `code:"${code}"`,
            `name:"${name}"`,
            `user.id:${user.id}`,
          )
          done(null, updatedUsers)
        } catch (e) {
          console.log(
            'passport:fail',
            `code:"${code}"`,
            `name:"${name}"`,
            `codeDirty:${codeDirty}`,
          )
          done(new Error('Keinen Nutzer gefunden'), null)
        }
      }),
    )

    passport.serializeUser((user, done) => {
      done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await pgdb.public.users.findOne({ id })
        done(null, user)
      } catch (e) {
        done(new Error('no matching user'), null)
      }
    })

    expressApp.use(passport.initialize())
    expressApp.use(passport.session())

    /* if (isDev) {
      expressApp.all('/graphql', async (req, res, next) => {
        console.log(req.method, req.url)
        await sleep(1000)
        next()
      })
    } */

    const graphqlApp = grapqhl({ pgdb })
    graphqlApp.applyMiddleware({ app: expressApp })

    expressApp.all('*', nextAppRequestHandler)

    expressApp.listen(port, (err) => {
      if (err) throw err
      console.log('server:ready', `port:${port}`)
    })
  })
