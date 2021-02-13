import gql from "graphql-tag";

const userDef = gql`
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

export default userDef;
