import { startServer } from "./server";
import { PORT } from "./utils/envVars";

startServer(PORT).catch((error) => {
  console.error(error.message);
});
