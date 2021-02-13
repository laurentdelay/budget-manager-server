import { Schema, model, Types } from "mongoose";

const operationSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: new Types.ObjectId() },
  body: String,
  amount: Number,
  date: Date,
  repeat: Boolean,
  target: String,
  user: { type: Schema.Types.ObjectId, ref: "users" },
  category: String,
  type: String,
});

export default model("Operation", operationSchema);
