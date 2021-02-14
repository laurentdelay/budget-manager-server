"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDatabase = void 0;
const mongoose_1 = require("mongoose");
const envVars_1 = require("./utils/envVars");
async function startDatabase() {
    if (envVars_1.MONGODB_URI == undefined || envVars_1.MONGODB_URI == "") {
        throw new Error("Wrong database URI");
    }
    const mongoDB = await mongoose_1.connect(envVars_1.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    mongoDB.connection;
}
exports.startDatabase = startDatabase;
//# sourceMappingURL=database.js.map