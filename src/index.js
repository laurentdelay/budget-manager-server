const { startDatabase } = require("./database");
const app = require("./server");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await startDatabase();

  app.listen(PORT, (err) => {
    if (err) {
      console.error("Error in server setup");
    }
    console.log(`Server listening on http://localhost:${PORT}/graphql`);
  });
};

startServer();
