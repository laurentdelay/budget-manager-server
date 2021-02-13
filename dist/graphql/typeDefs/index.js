"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_typedef_1 = __importDefault(require("./types/category.typedef"));
const operation_typedef_1 = __importDefault(require("./types/operation.typedef"));
const user_typedef_1 = __importDefault(require("./types/user.typedef"));
const utils_typedefs_1 = __importDefault(require("./types/utils.typedefs"));
const typeDefs = [utils_typedefs_1.default, user_typedef_1.default, category_typedef_1.default, operation_typedef_1.default];
exports.default = typeDefs;
