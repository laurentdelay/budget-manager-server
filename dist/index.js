"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const server_1 = __importDefault(require("./server"));
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await database_1.startDatabase();
    server_1.default
        .listen({ port: PORT })
        .then((res) => console.log(`Server listening on ${res.url}`));
};
startServer();
