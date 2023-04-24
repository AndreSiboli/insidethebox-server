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
//------------------------------------- Import -------------------------------------
const express_1 = __importDefault(require("express"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authToken_1 = require("../config/authToken");
const refreshToken_1 = require("../config/refreshToken");
//------------------------------------- Middleware -------------------------------------
const checkRegister_1 = __importDefault(require("../shared/middlewares/checkRegister"));
const verifyUser_1 = require("../shared/services/verifyUser");
//------------------------------------- Model -------------------------------------
const User_1 = __importDefault(require("../models/User"));
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
//------------------------------------- Config -------------------------------------
const router = express_1.default.Router();
//------------------------------------- Routes -------------------------------------
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, email, password } = req.body;
    const response = (0, checkRegister_1.default)({ name: name, email: email, password: password });
    if (!response.name || !response.email || !response.password)
        return res.json({ logErr: 'Dados incorretos.' });
    name = response.name;
    email = response.email;
    password = response.password;
    const passwordHash = yield (0, bcrypt_1.hash)(password, yield (0, bcrypt_1.genSalt)(10));
    yield User_1.default.findOne({ email: email })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user)
            return res.json({ logErr: 'Esse email já existe.' });
        yield createUser();
    }))
        .catch((err) => {
        return res.json({
            logErr: 'Não foi possivel se registrar. Se o erro persistir, tente novamente mais tarde.',
        });
    });
    function createUser() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new User_1.default({
                name: name,
                email: email,
                password: passwordHash,
            })
                .save()
                .then(() => {
                return res.json({ response: 'Cadastrado com sucesso.', redirect: true });
            })
                .catch((err) => {
                return res.json({
                    logErr: 'Não foi possivel se registrar. Se o erro persistir, tente novamente mais tarde.',
                });
            });
        });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, verifyUser_1.verifyUser)(req.body);
    console.log(user);
    if (!user)
        return res.json({ err: 'Email ou senha inválido.' });
    const JWTData = {
        iss: 'inside-the-box',
        sub: user.id,
    };
    const token = (0, authToken_1.generateToken)(JWTData);
    const refresh_token = (0, authToken_1.generateRefreshToken)(JWTData);
    if (!token || !refresh_token)
        return false;
    if (!(yield (0, refreshToken_1.deleteRefreshToken)(user.id)))
        return res.json({ err: 'Ocorreu um erro.' });
    const addingRefresh = yield (0, refreshToken_1.saveRefreshToken)({ user_id: user.id, refresh_token });
    if (!addingRefresh)
        return res.json({ err: 'Ocorreu um erro.' });
    res.json({ token, refresh_token, user });
}));
router.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { token } = req.body;
    const user_id = (_a = jsonwebtoken_1.default.decode(token)) === null || _a === void 0 ? void 0 : _a.sub;
    if (!user_id)
        return;
    const data = yield RefreshToken_1.default.deleteOne({ user_id })
        .then(() => {
        return true;
    })
        .catch((err) => {
        console.log('Falha ao se desconectar.'); //
    });
    if (data)
        return res.json({ response: true });
    res.json({ response: false });
}));
router.post('/token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token: oldRefToken } = req.body;
    const datas = jsonwebtoken_1.default.decode(oldRefToken);
    if (oldRefToken === null)
        res.status(401);
    const isOnDb = RefreshToken_1.default.findOne({ user_id: datas, refresh_token: oldRefToken })
        .then((data) => {
        if (data)
            return true;
        return false;
    })
        .catch((err) => {
        console.log('Esse token não existe');
        return false;
    });
    if (!isOnDb)
        return res.status(403).json({ res: 'No 403' });
    try {
        if (!datas)
            return;
        const tokenData = {
            sub: datas.sub,
            iss: datas.iss,
        };
        jsonwebtoken_1.default.verify(oldRefToken, process.env.SECRET_REFRESH_TOKEN);
        const token = (0, authToken_1.generateToken)(tokenData);
        const refreshToken = (0, authToken_1.generateRefreshToken)(tokenData);
        const user_id = datas.sub;
        const isSave = yield RefreshToken_1.default.deleteOne({ user_id }).then(() => __awaiter(void 0, void 0, void 0, function* () {
            const addingRefresh = yield (0, refreshToken_1.saveRefreshToken)({
                user_id,
                refresh_token: oldRefToken,
            });
            return addingRefresh;
        }));
        if (!isSave)
            res.json({ err: 'Ocorreu um erro' });
        else
            res.json({ token, refreshToken });
        console.log(datas);
    }
    catch (err) {
        console.log('Refresh Token Inválido');
    }
}));
router.post('/verify-refresh', (req, res) => {
    const { token } = req.body;
    if (!token)
        return res.json({ err: 'Ocorreu um erro.' });
    try {
        jsonwebtoken_1.default.verify(token, process.env.SECRET_REFRESH_TOKEN);
        return res.json({ result: true });
    }
    catch (err) {
        return res.json({ result: false });
    }
});
exports.default = router;
