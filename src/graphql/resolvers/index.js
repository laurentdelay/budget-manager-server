const categoriesResolvers = require("./categories.resolvers");
const usersResolvers = require("./users.resolvers");
const operationsResolvers = require("./operations.resolvers");

const resolvers = {
  User: {
    ...usersResolvers.User,
  },
  Query: {
    ...categoriesResolvers.Query,
    ...operationsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...categoriesResolvers.Mutation,
    ...operationsResolvers.Mutation,
  },
};

module.exports = resolvers;
