import express, { Request, Response } from 'express';

//------------------------------------- Models -------------------------------------
import Bible from '../models/quiz/Bible';
import History from '../models/quiz/History';
import Game from '../models/quiz/Game';
import Geography from '../models/quiz/Geography';
import Daily from '../models/quiz/Daily';
import Science from '../models/quiz/Science';

//------------------------------------- Questions -------------------------------------

import { bible } from '../questions/bible';
import { history } from '../questions/history';
import { games } from '../questions/games';
import { geography } from '../questions/geograph';
import { daily } from '../questions/daily';
import { science } from '../questions/science';

const router = express.Router();

router.get('/bible', (req: Request, res: Response) => {
    bible.forEach((bib) => {
        new Bible(bib)
            .save()
            .then(() => {
                res.send('Perguntas salvas no quiz: Bíblia');
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

router.get('/history', (req: Request, res: Response) => {
    history.forEach((his) => {
        new History(his)
            .save()
            .then(() => {
                res.send('Perguntas salvas no quiz: História');
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

router.get('/science', (req: Request, res: Response) => {
    science.forEach((sci) => {
        new Science(sci)
            .save()
            .then(() => {
                res.send('Perguntas salvas no quiz: Ciência');
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

router.get('/games', (req: Request, res: Response) => {
    games.forEach((game) => {
        new Game(game)
            .save()
            .then(() => {
                res.send('Perguntas salvas no quiz: Games');
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

router.get('/geography', (req: Request, res: Response) => {
    geography.forEach((geo) => {
        new Geography(geo)
            .save()
            .then(() => {
                res.send('Perguntas salvas no quiz: Geográfia');
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

router.get('/daily', (req: Request, res: Response) => {
    daily.forEach((day) => {
        new Daily(day)
            .save()
            .then(() => {
                res.send('Perguntas salvas no quiz: Cotidiano');
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

export default router;
