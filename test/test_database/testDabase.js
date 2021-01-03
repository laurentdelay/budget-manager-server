const mongoose = require("mongoose");

const User = require("../../src/models/user.model");
const { hashPassword } = require("../../src/utils/password");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/budget-manager";

const startDatabase = async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

const stopDatabase = async () => {
  await User.deleteMany({});

  const password = await hashPassword("password");

  const testUser = new User({
    email: "test@mail.com",
    password,
    username: "Testor",
    firstName: "Test",
    lastName: "User",
    fullName: "Test User",
    createdAt: new Date(),
  });

  await testUser.save();

  await mongoose.disconnect();
};

module.exports = { startDatabase, stopDatabase };
