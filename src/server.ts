import { ApolloServer } from "apollo-server";

import schema from "./graphql/schema";
import typeDefs from "./graphql/typeDefs";

const server = new ApolloServer({
  typeDefs,
  schema,
  context: ({ req }) => ({ req }),
});

export default server;
