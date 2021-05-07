const { ApolloServer } = require('apollo-server-express')
const { buildContext } = require('graphql-passport')
const { schema } = require('./schema')

module.exports = (connections) => new ApolloServer({
  schema,
  context: function (context) {
    return {
      ...buildContext(context),
      ...connections,
      getConnectionIdentity: function (context) {
        const sessionId = context.req?.sessionID
        const accountId = context.getUser()?.id

        if (!sessionId || !accountId) {
          return undefined
        }

        return {
          sessionId,
          accountId
        }
      }
    }
  }
})
