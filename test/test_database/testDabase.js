const mongoose = require("mongoose");

const User = require("../../src/models/user.model");
const Operation = require("../../src/models/operation.model");
const Category = require("../../src/models/category.model");
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

const initCategories = async () => {
  await Category.deleteMany({});

  const { categories } = data;

  for (const category of categories) {
    const testCategory = new Category(category);
    try {
      await testCategory.save();
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
  await mongoose.disconnect();
};

const resetCollections = async (collection) => {
  switch (collection) {
    case "users":
      await initUsers();
      break;
    case "operations":
      await initOperations();
      break;
    case "categories":
      await initCategories();
      break;
    default:
      break;
  }
};

const header = { Authorization: `Bearer ${generateToken(data.users[0])}` };

module.exports = { startDatabase, stopDatabase, resetCollections, header };
