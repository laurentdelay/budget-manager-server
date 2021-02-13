"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const userDef = graphql_tag_1.default `
  type User {
    id: ID!
    email: String!
    password: String!
    username: String
    firstName: String
    lastName: String
    fullName: String
    token: String!
    createdAt: Date!
  }

  # inputs definitions
  input RegisterInput {
    email: String!
    password: String!
    confirmPassword: String!
    username: String
    firstName: String = ""
    lastName: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ChangePasswordInput {
    oldPassword: String!
    newPassword: String!
    confirmNewPassword: String!
  }

  input PersonnalInfoInput {
    username: String
    firstName: String
    lastName: String
  }

  extend type Mutation {
    # users mutations
    register(userInput: RegisterInput!): User!
    login(userInput: LoginInput!): User!
    changePassword(userInput: ChangePasswordInput!): User!
    updateInfo(userInput: PersonnalInfoInput!): User!
  }
`;
exports.default = userDef;
