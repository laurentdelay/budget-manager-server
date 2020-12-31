const User = require("../../models/User");

const resolvers = {
  users: async () => {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new Error(error);
    }
  },
  hostname: (_, request) => {
    return request.hostname;
  },
};

module.exports = resolvers;
