import { Schema, model, Types } from "mongoose";

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

export default model("User", userSchema);
