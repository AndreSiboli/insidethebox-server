"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.Promise = global.Promise;
const conn = mongoose_1.default
    .connect('mongodb://127.0.0.1:27017/quiz')
    .then(() => {
    console.log('Database Connected');
})
    .catch((err) => {
    console.log("It wasn't possible to connect on database");
});
exports.default = conn;
