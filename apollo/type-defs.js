const { gql } = require('@apollo/client')

const typeDefs = gql`
type User {
  id: ID!
  code: String!
  name: String!
}

type Query {
  me: User
}

type Mutation {
  login(code: String!, name: String!): User!
  logout: Boolean!
}
`

module.exports = { typeDefs }