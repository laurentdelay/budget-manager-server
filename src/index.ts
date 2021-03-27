import { startDatabase } from "./database";
import { createServer } from "./server";
import { PORT } from "./utils/envVars";

const main = async () => {
  await startDatabase();
  const server = await createServer();
  server.listen(PORT, () =>
    console.log(`Server listening on http://localhost:${PORT}/graphql`)
  );
};

main();
