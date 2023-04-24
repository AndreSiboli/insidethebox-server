//------------------------------------- Imports -------------------------------------
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

//------------------------------------- Routes -------------------------------------
import question from './routes/question';
import login from './routes/login';
import addQuestions from './routes/addQuestions';

//------------------------------------- Setting -------------------------------------
dotenv.config();
const app = express();

const url = 'https://insidethebox.onrender.com';
//http://localhost:5173

const corsOptions = {
    origin: url,
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// //------------------------------------- Database -------------------------------------

mongoose.Promise = global.Promise;
mongoose
    .connect(process.env.DB_PORT)
    .then(() => {
        console.log('Database Connected'); //
    })
    .catch((err) => {
        console.log("It wasn't possible to connect on database");
    });

//------------------------------------- Routes -------------------------------------

app.get('/is-on', async (req: Request, res: Response) => {
    res.send('On');
});

app.use('/question', question);
app.use('/login', login);
app.use('/add', addQuestions);

//------------------------------------- Server -------------------------------------
const PORT = process.env.PORT;
app.listen(PORT, () => console.log('SERVER ON'));
