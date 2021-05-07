const { ApolloServer } = require('apollo-server-express')
const { buildContext } = require('graphql-passport')
const { schema } = require('./schema')

module.exports = (connections) =>
  new ApolloServer({
    schema,
    context: function (context) {
      const grapqlContext = {
        ...buildContext(context),
        ...connections,
      }

      const user = grapqlContext.getUser()

      return {
        ...grapqlContext,
        user,
      }
    },
  })
