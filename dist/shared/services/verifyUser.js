"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyToken = exports.verifyUser = void 0;
//------------------------------------- Imports -------------------------------------
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
//------------------------------------- Model -------------------------------------
const User_1 = __importDefault(require("../../models/User"));
//------------------------------------- Function -------------------------------------
function verifyUser(users) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = users;
        const data = yield User_1.default.findOne({ email: email })
            .then((user) => __awaiter(this, void 0, void 0, function* () {
            if (!user)
                return null;
            if (!user.password)
                return null;
            if (yield (0, bcrypt_1.compare)(password, user.password)) {
                user.password = undefined;
                user.__v = undefined;
                return user;
            }
            return null;
        }))
            .catch((err) => {
            console.log('User has been not found');
            return null;
        });
        return data;
    });
}
exports.verifyUser = verifyUser;
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        return res.status(401).json({ res: 'Negado.' });
    const token = authHeader.split(' ')[1];
    try {
        jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN);
        next();
    }
    catch (err) {
        console.log('Token Inválido');
        return res.status(401).json({ res: 'Negado.' });
    }
}
exports.verifyToken = verifyToken;
function verifyRefreshToken(refresh) {
    if (!refresh)
        return false;
    try {
        jsonwebtoken_1.default.verify(refresh, process.env.SECRET_REFRESH_TOKEN);
    }
    catch (err) {
        console.log('Token Inválido');
    }
}
exports.verifyRefreshToken = verifyRefreshToken;
