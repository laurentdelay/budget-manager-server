const categoriesResolvers = require("./categories.resolvers");
const usersResolvers = require("./users.resolvers");

const resolvers = {
  User: {
    ...usersResolvers.User,
  },
  Query: {
    ...categoriesResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...categoriesResolvers.Mutation,
  },
};

module.exports = resolvers;
