import { ApolloServer, ExpressContext } from "apollo-server-express";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";

import { startDatabase } from "./database";
import { User } from "./entities/User";

// Middlewares
import { authCheck } from "./middlewares/authCheck.middleware";
import { ErrorInterceptor } from "./middlewares/errorInterceptor.middleware";

//resolvers import
import { UserResolvers } from "./resolvers/User.resolvers";
import { CategoryResolvers } from "./resolvers/Category.resolvers";
import { EventResolvers } from "./resolvers/Event.resolvers";
import { GoalResolvers } from "./resolvers/Goal.resolvers";
import { SavingsResolvers } from "./resolvers/Savings.resolvers";

export const startServer = async (PORT: string): Promise<void> => {
  const schema = await buildSchema({
    resolvers: [
      UserResolvers,
      CategoryResolvers,
      EventResolvers,
      GoalResolvers,
      SavingsResolvers,
    ],
    emitSchemaFile: true,
    validate: {
      validationError: {
        target: false,
        value: false,
      },
    },
    globalMiddlewares: [ErrorInterceptor],
    authChecker: authCheck,
  });

  await startDatabase();

  const server = new ApolloServer({
    schema,
    context: ({ req }: ExpressContext) => {
      const token = req.headers?.authorization?.split("Bearer ")[1] ?? null;

      if (token != null) {
        try {
          return {
            req,
            user: User.decodeToken(token),
          };
        } catch (error) {}
      }
      return { user: null };
    },
  });

  const app = Express();

  server.applyMiddleware({ app });

  app.listen({ port: PORT }, () =>
    console.log(
      `Server listening on http://localhost:${PORT}${server.graphqlPath}`
    )
  );
};
