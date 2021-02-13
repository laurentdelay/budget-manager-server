import { startDatabase } from "./database";
import server from "./server";

const PORT = process.env.PORT ?? 5000;

async function startServer(): Promise<void> {
  await startDatabase();

  server
    .listen({ port: PORT })
    .then((res) => console.log(`Server listening on ${res.url}`));
}

startServer();
