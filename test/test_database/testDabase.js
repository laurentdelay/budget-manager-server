const mongoose = require("mongoose");

const User = require("../../src/models/user.model");
const Operation = require("../../src/models/operation.model");
const { hashPassword } = require("../../src/utils/password");
const { generateToken } = require("../../src/utils/token");
const data = require("./data.json");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/budget-manager";

const initUsers = async () => {
  await User.deleteMany({});

  const { users } = data;

  try {
    await User.insertMany(users);
  } catch (error) {
    console.log(error);
  }
  /* for (const user of users) {
    const password = await hashPassword(user.password);
    const testUser = new User({ ...user, password, createdAt: new Date() });
    try {
      await testUser.save();
    } catch (error) {
      console.log(error);
    }
  } */
};

const initOperations = async () => {
  await Operation.deleteMany({});

  const { operations } = data;

  for (const operation of operations) {
    const testOperation = new Operation(operation);
    try {
      await testOperation.save();
    } catch (error) {
      console.log(error);
    }
  }
};

const startDatabase = async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

const stopDatabase = async (env) => {
  switch (env) {
    case "users":
      await initUsers();
      break;
    case "operations":
      await initOperations();
      break;
    default:
      break;
  }

  await mongoose.disconnect();
};

const getTestToken = () => {
  return generateToken(data.users[0]);
};

module.exports = { startDatabase, stopDatabase, getTestToken };
