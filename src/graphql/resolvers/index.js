const usersResolvers = require("./users.resolvers");

const resolvers = {
  User: {
    ...usersResolvers.User,
  },
  Mutation: {
    ...usersResolvers.Mutation,
  },
};

module.exports = resolvers;
