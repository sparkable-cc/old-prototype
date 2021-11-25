const { gql } = require('@apollo/client')

const typeDefs = gql`
  scalar DateTime

  enum Stage {
    egg
    caterpillar
    chrysalis
    butterfy
    admin
  }

  type User {
    id: ID!
    email: String!
    username: String!
    bio: String
    city: String
    country: String
    stage: Stage!
    picture_url: String
    date_created: DateTime!
    date_verified: DateTime
    tokens: Int!
  }

  type Category {
    id: ID!
    title: String!
  }

  enum ContentType {
    web
    video
    image
    podcast
    document
  }

  type Content {
    id: ID!
    type: ContentType!
    url: String!
    title: String!
    description: String
    teaser_image_url: String
  }

  type Submission {
    id: ID!
    user: User!
    content: Content!
    category: Category!
    date_posted: DateTime!
    comment: String
    stage: Stage!
    votes: Int!
    meHasVoted: Boolean!
  }

  type Query {
    me: User
    categories: [Category!]!
    submissions(stage: Stage, category_id: ID): [Submission!]!
    my_submissions(user_id: ID): [Submission!]
  }

  type Mutation {
    vote(submission_id: ID!): Submission!
    signup(email: String!, username: String!, password: String!): User!
    login(username: String!, password: String!): User!
    logout: Boolean!
    categoryAdd(title: String!): Category!
    submit(comment: String, url: String!, category_id: ID!): Submission!
  }
`

module.exports = { typeDefs }
