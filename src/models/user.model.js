const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: String,
  password: String,
  username: String,
  firstName: String,
  lastName: String,
  fullName: String,
  createdAt: Date,
});

module.exports = model("User", userSchema);
