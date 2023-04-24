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
exports.deleteRefreshToken = exports.saveRefreshToken = void 0;
const RefreshToken_1 = __importDefault(require("../../models/RefreshToken"));
function saveRefreshToken(datas) {
    return __awaiter(this, void 0, void 0, function* () {
        //A data  de expiração é guardada em segundos
        const date = new Date();
        const fifteenDays = 24 * 60 * 60 * 1000 * 15;
        const expireIn = Math.floor(date.getTime() + fifteenDays / 1000);
        const { refresh_token, user_id } = datas; //1296000
        // ( (Math.floor(date.getTime() + fifteenDays)) - now.getTime() )/ 1000 pra verificar se venceu, se chegar a zero, venceu
        const data = yield new RefreshToken_1.default({
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
    });
}
exports.saveRefreshToken = saveRefreshToken;
function deleteRefreshToken(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!user_id)
            return false;
        const data = yield RefreshToken_1.default.deleteOne({ user_id })
            .then(() => {
            return true;
        })
            .catch((err) => {
            return false;
        });
        return data;
    });
}
exports.deleteRefreshToken = deleteRefreshToken;
