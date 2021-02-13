import mongoose from "mongoose";

const MONGODB_URI: string =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/budget-manager";

export async function startDatabase(): Promise<void> {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
}
