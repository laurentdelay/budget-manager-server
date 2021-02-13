"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, default: new mongoose_1.Types.ObjectId() },
    name: String,
    action: String,
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
});
exports.default = mongoose_1.model("Category", categorySchema);
