"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, default: new mongoose_1.Types.ObjectId() },
    email: String,
    password: String,
    username: String,
    firstName: String,
    lastName: String,
    fullName: String,
    createdAt: Date,
});
exports.default = mongoose_1.model("User", userSchema);
