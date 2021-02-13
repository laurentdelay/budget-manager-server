import gql from "graphql-tag";

const utilsDef = gql`
  # Query & Mutation root def to enable extend => do not remove
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }

  scalar Date

  enum Positivity {
    POSITIVE
    NEGATIVE
    CHOICE
  }
`;

export default utilsDef;
