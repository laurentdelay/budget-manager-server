import gql from "graphql-tag";

const categoryDef = gql`
  type Category {
    id: ID!
    name: String!
    action: Positivity!
    user: ID
  }

  input categoryInfo {
    name: String!
    action: Positivity!
  }

  extend type Query {
    # renvoie une liste de catégories liées à un utilisateur et les catégories par défaut
    categories: [Category]!
  }

  extend type Mutation {
    newCategory(userInput: categoryInfo): Category!
    removeCategory(categoryId: ID!): String!
  }
`;

export default categoryDef;
