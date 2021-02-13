"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const schema_1 = __importDefault(require("./graphql/schema"));
const typeDefs_1 = __importDefault(require("./graphql/typeDefs"));
const server = new apollo_server_1.ApolloServer({
    typeDefs: typeDefs_1.default,
    schema: schema_1.default,
    context: ({ req }) => ({ req }),
});
exports.default = server;
