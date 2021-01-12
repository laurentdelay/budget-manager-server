const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: new Types.ObjectId() },
  email: String,
  password: String,
  username: String,
  firstName: String,
  lastName: String,
  fullName: String,
  createdAt: Date,
});

module.exports = model("User", userSchema);
