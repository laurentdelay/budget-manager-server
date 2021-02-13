"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const operationDef = graphql_tag_1.default `
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
exports.default = operationDef;
