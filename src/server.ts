import { ApolloServer, ExpressContext } from "apollo-server-express";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { User } from "./entities/User";
// Middlewares
import { authCheck } from "./middlewares/authCheck.middleware";
import { ErrorInterceptor } from "./middlewares/errorInterceptor.middleware";
import { CategoryResolvers } from "./resolvers/Category.resolvers";
import { EventResolvers } from "./resolvers/Event.resolvers";
import { GoalResolvers } from "./resolvers/Goal.resolvers";
import { SavingsResolvers } from "./resolvers/Savings.resolvers";
//resolvers import
import { UserResolvers } from "./resolvers/User.resolvers";

export const createServer = async (): Promise<Express.Application> => {
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

  return app;
};
