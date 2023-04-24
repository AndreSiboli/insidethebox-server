"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//------------------------------------- Imports -------------------------------------
const express_1 = __importDefault(require("express"));
//------------------------------------- Models -------------------------------------
const History_1 = __importDefault(require("../models/quiz/History"));
const Game_1 = __importDefault(require("../models/quiz/Game"));
const Geography_1 = __importDefault(require("../models/quiz/Geography"));
const Bible_1 = __importDefault(require("../models/quiz/Bible"));
const Daily_1 = __importDefault(require("../models/quiz/Daily"));
const Science_1 = __importDefault(require("../models/quiz/Science"));
//------------------------------------- Middleware -------------------------------------
const verifyUser_1 = require("../shared/services/verifyUser");
//------------------------------------- Configs -------------------------------------
const router = express_1.default.Router();
//------------------------------------- Routes -------------------------------------
function giveTable(category) {
    if (category.toLowerCase() === 'history')
        return History_1.default;
    else if (category.toLowerCase() === 'games')
        return Game_1.default;
    else if (category.toLowerCase() === 'geography')
        return Geography_1.default;
    else if (category.toLowerCase() === 'bible')
        return Bible_1.default;
    else if (category.toLowerCase() === 'daily')
        return Daily_1.default;
    else if (category.toLowerCase() === 'science')
        return Science_1.default;
    else
        return null;
}
//Get all questions
router.post('/get-questions', verifyUser_1.verifyToken, (req, res) => {
    const { category } = req.body;
    if (!category)
        res.json({ logErr: 'Não foi possivel encontrar essa categoria.' });
    const Table = giveTable(category);
    if (!Table)
        return res.json({ logErr: 'Essa categoria não existe.', redirect: true });
    Table.find()
        .select('_id')
        .then((data) => {
        const shuffledArray = data.sort(() => Math.random() - 0.5);
        const chosenQuestions = shuffledArray.slice(0, 10);
        return res.json({ questions: chosenQuestions });
    })
        .catch((err) => {
        return res.json({ logErr: 'Não foi possivel' });
    });
});
//Get question
router.post('/get-question', (req, res) => {
    const { id, category } = req.body;
    if (!category || !id)
        return false;
    const Table = giveTable(category);
    if (!Table)
        return false;
    Table.findById(id)
        .select('-answers.isCorrect')
        .then((question) => {
        if (!question)
            return false;
        return res.json({ question: question });
    });
});
//Check questions
router.post('/check-question', verifyUser_1.verifyToken, (req, res) => {
    const { category, idQuestion, userResponse } = req.body;
    if (!category || !idQuestion || !userResponse)
        return false;
    const Table = giveTable(category);
    if (!Table)
        return false;
    Table.findById(idQuestion)
        .then((answer) => {
        if (!answer)
            return res.sendStatus(404);
        const { answers } = answer;
        let isExact = false;
        answers.forEach((ans) => {
            if (answers.find(() => ans.id === userResponse && ans.isCorrect))
                isExact = true;
        });
        if (!isExact)
            return res.json({ response: false });
        return res.json({ response: true });
    })
        .catch((err) => {
        return res.json({ err: 'Ocorreu um erro. Tente mais tarde.' });
    });
});
exports.default = router;
