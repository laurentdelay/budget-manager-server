"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const utilsDef = graphql_tag_1.default `
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
exports.default = utilsDef;
