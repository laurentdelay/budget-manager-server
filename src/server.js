const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const expressPlayground = require("graphql-playground-middleware-express")
  .default;

const schema = require("./graphql/schema");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
  })
);

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

module.exports = app;
