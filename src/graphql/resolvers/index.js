const usersResolvers = require("./users.resolvers");

const resolvers = {
  Mutation: {
    ...usersResolvers.Mutation,
  },
};

module.exports = resolvers;
