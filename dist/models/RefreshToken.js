"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const RefreshToken = new Schema({
    expireIn: {
        type: Number,
        require: true,
    },
    refresh_token: {
        type: String,
        require: true,
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        require: true,
        unique: true,
    },
});
exports.default = mongoose_1.default.model('refresh_token', RefreshToken);
