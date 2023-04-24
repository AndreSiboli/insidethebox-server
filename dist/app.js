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
//------------------------------------- Imports -------------------------------------
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
//------------------------------------- Routes -------------------------------------
const question_1 = __importDefault(require("./routes/question"));
const login_1 = __importDefault(require("./routes/login"));
const addQuestions_1 = __importDefault(require("./routes/addQuestions"));
//------------------------------------- Setting -------------------------------------
dotenv_1.default.config();
const app = (0, express_1.default)();
const url = 'https://insidethebox.onrender.com';
//http://localhost:5173
const corsOptions = {
    origin: url,
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
// //------------------------------------- Database -------------------------------------
mongoose_1.default.Promise = global.Promise;
mongoose_1.default
    .connect(process.env.DB_PORT)
    .then(() => {
    console.log('Database Connected'); //
})
    .catch((err) => {
    console.log("It wasn't possible to connect on database");
});
//------------------------------------- Routes -------------------------------------
app.get('/is-on', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('On');
}));
app.use('/question', question_1.default);
app.use('/login', login_1.default);
app.use('/add', addQuestions_1.default);
//------------------------------------- Server -------------------------------------
const PORT = process.env.PORT;
app.listen(PORT, () => console.log('SERVER ON'));
