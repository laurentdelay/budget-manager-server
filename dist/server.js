"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const database_1 = require("./database");
const User_1 = require("./entities/User");
const authCheck_middleware_1 = require("./middlewares/authCheck.middleware");
// Middlewares
const errorInterceptor_middleware_1 = require("./middlewares/errorInterceptor.middleware");
//resolvers import
const User_resolvers_1 = require("./resolvers/User.resolvers");
const Category_resolvers_1 = require("./resolvers/Category.resolvers");
const Event_resolvers_1 = require("./resolvers/Event.resolvers");
const Goal_resolvers_1 = require("./resolvers/Goal.resolvers");
const startServer = async (PORT) => {
    const schema = await type_graphql_1.buildSchema({
        resolvers: [
            User_resolvers_1.UserResolvers,
            Category_resolvers_1.CategoryResolvers,
            Event_resolvers_1.EventResolvers,
            Goal_resolvers_1.GoalResolvers,
        ],
        emitSchemaFile: true,
        validate: {
            validationError: {
                target: false,
                value: false,
            },
        },
        globalMiddlewares: [errorInterceptor_middleware_1.ErrorInterceptor],
        authChecker: authCheck_middleware_1.authCheck,
    });
    await database_1.startDatabase();
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req }) => {
            const token = req.headers?.authorization?.split("Bearer ")[1] ?? null;
            if (token != null) {
                try {
                    return {
                        req,
                        user: User_1.User.decodeToken(token),
                    };
                }
                catch (error) { }
            }
            return { user: null };
        },
    });
    const app = express_1.default();
    server.applyMiddleware({ app });
    app.listen({ port: PORT }, () => console.log(`Server listening on http://localhost:${PORT}${server.graphqlPath}`));
};
exports.startServer = startServer;
//# sourceMappingURL=server.js.map