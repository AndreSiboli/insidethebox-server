import RefreshToken from '../models/RefreshToken';

export async function saveRefreshToken(datas: any) {
    //A data  de expiração é guardada em segundos
    const date = new Date();
    const fifteenDays = 24 * 60 * 60 * 1000 * 15;
    const expireIn = Math.floor(date.getTime() + fifteenDays / 1000);
    const { refresh_token, user_id } = datas; 
    // ( (Math.floor(date.getTime() + fifteenDays)) - now.getTime() )/ 1000 pra verificar se venceu, se chegar a zero, venceu

    const data = await new RefreshToken({
        expireIn,
        refresh_token,
        user_id,
    })
        .save()
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.log(err);
            return false;
        });

    return data;
}

export async function deleteRefreshToken(user_id: string) {
    if (!user_id) return false;

    const data = await RefreshToken.deleteOne({ user_id })
        .then(() => {
            return true;
        })
        .catch((err) => {
            return false;
        });

    return data;
}
