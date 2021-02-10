const { Schema, model, Types } = require("mongoose");

const categorySchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: new Types.ObjectId() },
  name: String,
  action: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Category", categorySchema);
