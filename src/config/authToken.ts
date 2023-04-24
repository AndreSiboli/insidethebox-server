//------------------------------------- Imports -------------------------------------
import jwt from 'jsonwebtoken';

//------------------------------------- Types -------------------------------------
interface GenerateTokenType {
    iss: string;
    sub: string;
}

//------------------------------------- Functions -------------------------------------
export const generateToken = (data: GenerateTokenType) => {
    return jwt.sign(data, process.env.SECRET_TOKEN, { algorithm: 'HS256', expiresIn: '2m' });
};

export const generateRefreshToken = (data: GenerateTokenType) => {
    return jwt.sign(data, process.env.SECRET_REFRESH_TOKEN, {
        algorithm: 'HS256',
        expiresIn: '10d',
    });
};
