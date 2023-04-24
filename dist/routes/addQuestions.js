"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//------------------------------------- Models -------------------------------------
const Bible_1 = __importDefault(require("../models/quiz/Bible"));
const History_1 = __importDefault(require("../models/quiz/History"));
const Game_1 = __importDefault(require("../models/quiz/Game"));
const Geography_1 = __importDefault(require("../models/quiz/Geography"));
const Daily_1 = __importDefault(require("../models/quiz/Daily"));
const Science_1 = __importDefault(require("../models/quiz/Science"));
//------------------------------------- Questions -------------------------------------
const bible_1 = require("../questions/bible");
const history_1 = require("../questions/history");
const games_1 = require("../questions/games");
const geograph_1 = require("../questions/geograph");
const daily_1 = require("../questions/daily");
const science_1 = require("../questions/science");
const router = express_1.default.Router();
router.get('/bible', (req, res) => {
    bible_1.bible.forEach((bib) => {
        new Bible_1.default(bib)
            .save()
            .then(() => {
            res.send('Perguntas salvas no quiz: Bíblia');
        })
            .catch((err) => {
            console.log(err);
        });
    });
});
router.get('/history', (req, res) => {
    history_1.history.forEach((his) => {
        new History_1.default(his)
            .save()
            .then(() => {
            res.send('Perguntas salvas no quiz: História');
        })
            .catch((err) => {
            console.log(err);
        });
    });
});
router.get('/science', (req, res) => {
    science_1.science.forEach((sci) => {
        new Science_1.default(sci)
            .save()
            .then(() => {
            res.send('Perguntas salvas no quiz: Ciência');
        })
            .catch((err) => {
            console.log(err);
        });
    });
});
router.get('/games', (req, res) => {
    games_1.games.forEach((game) => {
        new Game_1.default(game)
            .save()
            .then(() => {
            res.send('Perguntas salvas no quiz: Games');
        })
            .catch((err) => {
            console.log(err);
        });
    });
});
router.get('/geography', (req, res) => {
    geograph_1.geography.forEach((geo) => {
        new Geography_1.default(geo)
            .save()
            .then(() => {
            res.send('Perguntas salvas no quiz: Geográfia');
        })
            .catch((err) => {
            console.log(err);
        });
    });
});
router.get('/daily', (req, res) => {
    daily_1.daily.forEach((day) => {
        new Daily_1.default(day)
            .save()
            .then(() => {
            res.send('Perguntas salvas no quiz: Cotidiano');
        })
            .catch((err) => {
            console.log(err);
        });
    });
});
exports.default = router;
