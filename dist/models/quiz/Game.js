"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Game = new Schema({
    question: {
        type: String,
        required: true,
    },
    answers: [
        {
            text: {
                type: String,
                require: true,
            },
            isCorrect: {
                type: Boolean,
                default: false,
            },
        },
        {
            text: {
                type: String,
                require: true,
            },
            isCorrect: {
                type: Boolean,
                default: false,
            },
        },
        {
            text: {
                type: String,
                require: true,
            },
            isCorrect: {
                type: Boolean,
                default: false,
            },
        },
        {
            text: {
                type: String,
                require: true,
            },
            isCorrect: {
                type: Boolean,
                default: false,
            },
        },
    ],
});
exports.default = mongoose_1.default.model('game', Game);
