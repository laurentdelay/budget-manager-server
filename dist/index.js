"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const envVars_1 = require("./utils/envVars");
server_1.startServer(envVars_1.PORT).catch((error) => {
    console.error(error.message);
});
//# sourceMappingURL=index.js.map