//------------------------------------- Import -------------------------------------
import express from 'express';
import { hash, genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from '../config/authToken';
import { deleteRefreshToken, saveRefreshToken } from '../config/refreshToken';

//------------------------------------- Middleware -------------------------------------
import checkRegister from '../shared/middlewares/checkRegister';
import { verifyUser } from '../shared/services/verifyUser';

//------------------------------------- Model -------------------------------------
import User from '../models/User';
import RefreshToken from '../models/RefreshToken';

//------------------------------------- Config -------------------------------------
const router = express.Router();

//------------------------------------- Types -------------------------------------
interface userTypes {
    id: string;
    name: string;
    email: string;
    date: Date;
}

//------------------------------------- Routes -------------------------------------
router.post('/register', async (req, res) => {
    let { name, email, password } = req.body;

    const response = checkRegister({ name: name, email: email, password: password });

    if (!response.name || !response.email || !response.password)
        return res.json({ logErr: 'Dados incorretos.' });

    name = response.name;
    email = response.email;
    password = response.password;

    const passwordHash = await hash(password, await genSalt(10));

    await User.findOne({ email: email })
        .then(async (user) => {
            if (user) return res.json({ logErr: 'Esse email já existe.' });
            await createUser();
        })
        .catch((err) => {
            return res.json({
                logErr: 'Não foi possivel se registrar. Se o erro persistir, tente novamente mais tarde.',
            });
        });

    async function createUser() {
        await new User({
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
    }
});

router.post('/login', async (req, res) => {
    const user: userTypes | null = await verifyUser(req.body);
    if (!user) return res.json({ err: 'Email ou senha inválido.' });

    const JWTData = {
        iss: 'inside-the-box',
        sub: user.id,
    };

    const token = generateToken(JWTData);
    const refresh_token: string = generateRefreshToken(JWTData);
    if (!token || !refresh_token) return false;

    if (!(await deleteRefreshToken(user.id))) return res.json({ err: 'Ocorreu um erro.' });
    const addingRefresh = await saveRefreshToken({ user_id: user.id, refresh_token });

    if (!addingRefresh) return res.json({ err: 'Ocorreu um erro.' });
    res.json({ token, refresh_token, user });
});

router.post('/logout', async (req, res) => {
    const { token } = req.body;
    const user_id: any = jwt.decode(token)?.sub;
    if (!user_id) return;

    const data = await RefreshToken.deleteOne({ user_id })
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.log('Falha ao se desconectar.');
        });

    if (data) return res.json({ response: true });
    res.json({ response: false });
});

router.post('/token', async (req, res) => {
    const { token: oldRefToken }: { token: string } = req.body;
    const datas: any = jwt.decode(oldRefToken);
    if (oldRefToken === null) res.status(401);

    const isOnDb = RefreshToken.findOne({ user_id: datas, refresh_token: oldRefToken })
        .then((data) => {
            if (data) return true;
            return false;
        })
        .catch((err) => {
            console.log('Esse token não existe');
            return false;
        });
    if (!isOnDb) return res.status(403).json({ res: 'No 403' });

    try {
        if (!datas) return;
        const tokenData = {
            sub: datas.sub,
            iss: datas.iss,
        };

        jwt.verify(oldRefToken, process.env.SECRET_REFRESH_TOKEN);

        const token = generateToken(tokenData);
        const refreshToken = generateRefreshToken(tokenData);
        const user_id = datas.sub;

        const isSave = await RefreshToken.deleteOne({ user_id }).then(async () => {
            const addingRefresh = await saveRefreshToken({
                user_id,
                refresh_token: oldRefToken,
            });
            return addingRefresh;
        });

        if (!isSave) res.json({ err: 'Ocorreu um erro' });
        else res.json({ token, refreshToken });

    } catch (err) {
        console.log('Refresh Token Inválido');
    }
});

router.post('/verify-refresh', (req, res) => {
    const { token } = req.body;
    if (!token) return res.json({ err: 'Ocorreu um erro.' });
    try {
        jwt.verify(token, process.env.SECRET_REFRESH_TOKEN);
        return res.json({ result: true });
    } catch (err) {
        return res.json({ result: false });
    }
});

export default router;
