import gql from "graphql-tag";

const operationDef = gql`
  type Operation {
    id: ID!
    body: String!
    amount: Float!
    date: Date!
    repeat: Boolean!
    goal: String
    category: ID!
    positive: Boolean!
  }

  extend type Query {
    userOperations: [Operation]!
  }

  extend type Mutation {
    addOperation: Operation!
    deleteOperation(operationId: ID!): String!
  }
`;

export default operationDef;
