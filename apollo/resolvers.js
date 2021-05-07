const resolvers = {
  Query: {
    me: async (parent, args, context, info) => {
      return context.getUser()
    },
  },
  Mutation: {
    login: async (parent, args, context, info) => {
      const { code, name } = args

      const { user } = await context.authenticate(
        'graphql-local',
        { email: code, password: name }
      )

      await context.login(user)

      return user
    },
    logout: async (parent, args, context, info) => {
      await context.logout()
      context.req.session.destroy()

      return true
    },
  }
}

module.exports = { resolvers }
