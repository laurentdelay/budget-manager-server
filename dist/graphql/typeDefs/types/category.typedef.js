"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const categoryDef = graphql_tag_1.default `
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
exports.default = categoryDef;
