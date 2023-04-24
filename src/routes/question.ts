//------------------------------------- Imports -------------------------------------
import express, { Request, Response } from 'express';

//------------------------------------- Models -------------------------------------
import History from '../models/quiz/History';
import Game from '../models/quiz/Game';
import Geography from '../models/quiz/Geography';
import Bible from '../models/quiz/Bible';
import Daily from '../models/quiz/Daily';
import Science from '../models/quiz/Science';

//------------------------------------- Middleware -------------------------------------
import { verifyToken } from '../shared/services/verifyUser';

//------------------------------------- Configs -------------------------------------
const router = express.Router();

//------------------------------------- Types -------------------------------------
interface CheckTypes {
    category: string;
    idQuestion: string;
    userResponse: string;
}

//------------------------------------- Routes -------------------------------------
function giveTable(category: string) {
    if (category.toLowerCase() === 'history') return History;
    else if (category.toLowerCase() === 'games') return Game;
    else if (category.toLowerCase() === 'geography') return Geography;
    else if (category.toLowerCase() === 'bible') return Bible;
    else if (category.toLowerCase() === 'daily') return Daily;
    else if (category.toLowerCase() === 'science') return Science;
    else return null;
}

//Get all questions
router.post('/get-questions', verifyToken, (req: Request, res: Response) => {
    const { category }: { category: string } = req.body;
    if (!category) res.json({ logErr: 'Não foi possivel encontrar essa categoria.' });

    const Table = giveTable(category);
    if (!Table) return res.json({ logErr: 'Essa categoria não existe.', redirect: true });

    Table.find()
        .select('_id')
        .then((data: any) => {
            const shuffledArray = data.sort(() => Math.random() - 0.5);
            const chosenQuestions = shuffledArray.slice(0, 10);
            return res.json({ questions: chosenQuestions });
        })
        .catch((err: string) => {
            return res.json({ logErr: 'Não foi possivel' });
        });
});

//Get question
router.post('/get-question', (req: Request, res: Response) => {
    const { id, category } = req.body;
    if (!category || !id) return false;

    const Table = giveTable(category);
    if (!Table) return false;

    Table.findById(id)
        .select('-answers.isCorrect')
        .then((question: any) => {
            if (!question) return false;

            return res.json({ question: question });
        });
});

//Check questions
router.post('/check-question', verifyToken, (req: Request, res: Response) => {
    const { category, idQuestion, userResponse }: CheckTypes = req.body;
    if (!category || !idQuestion || !userResponse) return false;

    const Table = giveTable(category);
    if (!Table) return false;

    Table.findById(idQuestion)
        .then((answer: any) => {
            if (!answer) return res.sendStatus(404);
            const { answers } = answer;

            let isExact = false;

            answers.forEach((ans: any) => {
                if (answers.find(() => ans.id === userResponse && ans.isCorrect)) isExact = true;
            });

            if (!isExact) return res.json({ response: false });
            return res.json({ response: true });
        })
        .catch((err: string) => {
            return res.json({ err: 'Ocorreu um erro. Tente mais tarde.' });
        });
});

export default router;
