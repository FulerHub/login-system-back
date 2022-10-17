import {Token} from "../models/token";
import jwt from "jsonwebtoken";

interface IGenerateToken {
    accessToken:string
    refreshToken:string
}

class TokenService {
    generate(payload:iTokenPayload):IGenerateToken {
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET as string,{expiresIn:'30m'});
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET as string,{expiresIn:'30d'});
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