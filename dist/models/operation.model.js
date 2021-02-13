"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const operationSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, default: new mongoose_1.Types.ObjectId() },
    body: String,
    amount: Number,
    date: Date,
    repeat: Boolean,
    target: String,
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "users" },
    category: String,
    type: String,
});
exports.default = mongoose_1.model("Operation", operationSchema);
