"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// TODO move to User class
const hashPassword = async (password) => {
    const hashedPass = await bcrypt_1.default.hash(password, 12);
    return hashedPass;
};
exports.hashPassword = hashPassword;
//# sourceMappingURL=password.js.map