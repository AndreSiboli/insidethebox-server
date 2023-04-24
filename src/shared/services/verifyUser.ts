//------------------------------------- Imports -------------------------------------
import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';

//------------------------------------- Model -------------------------------------
import User from '../../models/User';

//------------------------------------- Types -------------------------------------
import { Request, Response, NextFunction } from 'express';
interface userTypes {
    id: string;
    email: string;
    name: string;
    password: string | undefined;
    date: Date;
    __v: number | undefined;
}

//------------------------------------- Function -------------------------------------

export async function verifyUser(users: any) {
    const { email, password } = users;

    const data: userTypes | null = await User.findOne<userTypes>({ email: email })
        .then(async (user) => {
            if (!user) return null;
            if (!user.password) return null;
            if (await compare(password, user.password)) {
                user.password = undefined;
                user.__v = undefined;
                return user;
            }
            return null;
        })
        .catch((err) => {
            console.log('User has been not found');
            return null;
        });

    return data;
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ res: 'Negado.' });
    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.SECRET_TOKEN);
        next();
    } catch (err) {
        console.log('Token Inválido');
        return res.status(401).json({ res: 'Negado.' });
    }
}

export function verifyRefreshToken(refresh: any) {
    if (!refresh) return false;

    try {
        jwt.verify(refresh, process.env.SECRET_REFRESH_TOKEN);
    } catch (err) {
        console.log('Token Inválido');
    }
}
