import {Token} from "../models/token";
import jwt from "jsonwebtoken";

class TokenService {
    generate(payload:any) {
        const accessToken = jwt.sign(payload, 'SECRET_KEY',{expiresIn:'30m'});
        const refreshToken = jwt.sign(payload, 'SECRET_KEY',{expiresIn:'30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(id:number, token:string) {
        const getToken = await Token.findOne({ where: { user_id: id } });
        if (getToken) {
            getToken.refreshToken = token;
            return getToken.save();
        }
        return await Token.create({user_id: id, refreshToken: token});
    }

    async removeToken(token:string) {
        return await Token.destroy({ where: { refreshToken: token } });
    }

    async findToken(token:string) {
        return await Token.findOne({where: {refreshToken: token}});
    }
}
export default new TokenService();