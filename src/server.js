const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,

    rootValue: resolvers,
    graphiql: true,
  })
);

module.exports = app;
