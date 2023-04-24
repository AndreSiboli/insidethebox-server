"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = void 0;
//------------------------------------- Imports -------------------------------------
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//------------------------------------- Functions -------------------------------------
const generateToken = (data) => {
    return jsonwebtoken_1.default.sign(data, process.env.SECRET_TOKEN, { algorithm: 'HS256', expiresIn: '2m' });
};
exports.generateToken = generateToken;
const generateRefreshToken = (data) => {
    return jsonwebtoken_1.default.sign(data, process.env.SECRET_REFRESH_TOKEN, {
        algorithm: 'HS256',
        expiresIn: '10d',
    });
};
exports.generateRefreshToken = generateRefreshToken;
