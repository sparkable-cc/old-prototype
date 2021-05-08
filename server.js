const { GraphQLLocalStrategy } = require('graphql-passport')
const { PgDb } = require('pogi')
const compression = require('compression')
const connectPgSimple = require('connect-pg-simple')
const express = require('express')
const next = require('next')
const passport = require('passport')
const session = require('express-session')
const bcrypt = require('bcrypt')

const grapqhl = require('./apollo/server')

const isDev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT, 10) || 3000
const sessionName = process.env.SESSION_NAME || 'dion'
const sessionSecret = process.env.SESSION_SECRET || 'Ne partez pas sans moi'
const sessionCookieMaxAge =
  parseInt(process.env.SESSION_COOKIE_MAXAGE, 10) || 1000 * 60 * 60 * 24 * 7 // 7 days
const SessionStore = connectPgSimple(session)

const nextApp = next({ dev: isDev })
const nextAppRequestHandler = nextApp.getRequestHandler()

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
        name: sessionName,
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        rolling: false,
        cookie: {
          httpOnly: true,
          secure: !isDev,
          maxAge: sessionCookieMaxAge,
          sameSite: true,
        },
      }),
    )

    /**
     * Passport
     */
    passport.use(
      new GraphQLLocalStrategy(async (username, password, done) => {
        try {
          const user = await pgdb.public.users.findOne({
            or: [{ username }, { email: username }],
          })
          if (!user) {
            throw new Error('User not found')
          }
          if (!(await bcrypt.compare(password, user.hash))) {
            throw new Error('Password mismatch')
          }

          done(null, user)
        } catch (e) {
          console.error(e)
          done(
            new Error(
              'Either we do not know your or your password is waaaaay off.',
            ),
            null,
          )
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
