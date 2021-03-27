import { connect } from "mongoose";

import { MONGODB_URI } from "./utils/envVars";

export async function startDatabase(): Promise<void> {
  if (MONGODB_URI == undefined || MONGODB_URI == "") {
    throw new Error("Wrong database URI");
  }

  await connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
}
