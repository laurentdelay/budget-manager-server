const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: String,
  password: String,
  username: String,
  first_name: String,
  last_name: String,
  full_name: String,
});

module.exports = model("User", userSchema);
