const bcrypt = require('bcrypt')

const DateTime = require('./scalar/DateTime')

const resolvers = {
  DateTime,
  Query: {
    me: async (parent, args, context, info) => {
      return context.getUser()
    },
    categories: async (parent, args, context, info) => {
      return context.pgdb.public.categories.findAll({
        orderBy: { title: 'DESC' },
      })
    },
  },
  Mutation: {
    categoryAdd: async (parent, args, context, info) => {
      const { title } = args
      const { pgdb } = context

      const categories = pgdb.public.categories

      if (await categories.count({ title })) {
        throw new Error('Titel der Kategorie existiert bereits')
      }

      return categories.insertAndGet({ title })
    },
    signup: async (parent, args, context, info) => {
      const { email, username, password } = args
      const { pgdb, login } = context

      // @TODO prevent signup when authorized
      // @TODO add some rudementary validation, email, username

      const hasUser = await pgdb.public.users.count({
        or: [{ email }, { username }],
      })

      if (hasUser) {
        throw new Error('Konto gibts schon')
      }

      const hash = await bcrypt.hash(password, 10)
      const user = await pgdb.public.users.insertAndGet({
        email,
        username,
        hash,
      })

      await login(user)

      return user
    },
    login: async (parent, args, context, info) => {
      const { username, password } = args

      // @TODO prevent login when authorized

      const { user } = await context.authenticate('graphql-local', {
        email: username,
        password,
      })

      await context.login(user)

      return user
    },
    logout: async (parent, args, context, info) => {
      await context.logout()
      context.req.session.destroy()

      return true
    },
  },
}

module.exports = { resolvers }
