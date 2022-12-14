import {NextFunction, Request, Response} from "express";
import {Users} from "../models/users";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import Mail from "../services/mail.service"
import TokenService from "../services/token.service"


class AuthController {
    public async registration(req: Request, res: Response, next:NextFunction) {
        try{
            const {email, password} = req.body;
            const user = await Users.findOne({ where: { email: email } });
            if(user) return res.status(400).json({message: "User with this email address already exists"});

            const hashPassword = bcrypt.hashSync(password, 9);
            const link = crypto.randomUUID();

            let newUser = await Users.create({
                email: email,
                password: hashPassword,
                activationLink: link
            });

            await Mail.sendActivate(email,`https://api.river-fuler.space/api/auth/activate/${link}`);

            let payload:iTokenPayload = {
                id: newUser.id,
                email: newUser.email,
                isActivated: newUser.isActivated,
            };

            const {accessToken, refreshToken} = TokenService.generate(payload);
            await TokenService.saveToken(newUser.id,refreshToken);

            res.cookie('refreshToken', refreshToken,{maxAge: 30*24*60*60*1000, httpOnly: true, secure:true, sameSite: 'none' });

            return res.status(200).json({
                id:newUser.id,
                email:newUser.email,
                isActivated:newUser.isActivated,
                accessToken,
                refreshToken,
            });
        }catch (e) {
            res.status(400).json({message:"Error: Can't create user",error: e});
        }
    }
    public async login(req: Request, res: Response, next:NextFunction) {
        try{
            const {email, password} = req.body;
            const user = await Users.findOne({ where: { email: email } });
            if(!user) return res.status(400).json({message: "User with this email was not found"});
            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) return res.status(400).json({message: "Invalid password"});

            let payload:iTokenPayload = {
                id: user.id,
                email: user.email,
                isActivated: user.isActivated,
            };

            const {accessToken, refreshToken} = TokenService.generate(payload);
            await TokenService.saveToken(user.id,refreshToken);


            res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure:true, sameSite: 'none'});
            return res.status(200).json({
                id:user.id,
                email:user.email,
                isActivated:user.isActivated,
                accessToken,
                refreshToken,
            });
        }catch (e) {
            res.status(400).json({message:"Error: Can't enter in account"});
        }
    }
    public async logout(req: Request, res: Response, next:NextFunction) {
        try{
            const {refreshToken} = req.cookies;
            const token = await TokenService.removeToken(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json(token);
        }catch (e) {
            res.status(400).json({message:"Error: Can't logout"});
        }
    }
    public async activate(req: Request, res: Response, next:NextFunction) {
        try{
            const link = req.params.link;
            const user = await Users.findOne({ where: { activationLink: link } });
            if(!user) return res.status(400).json({message: "Incorrect activation link"});
            user.isActivated = true;
            await user.save();
            return res.redirect(process.env.REDIRECT_ACTIVATED_URL as string);
        }catch (e) {
            res.status(400).json({message:"Error: Can't activate"});
        }
    }
    public async refresh(req: Request, res: Response, next:NextFunction) {
        try{
            const {refreshToken} = req.cookies;
            if (!refreshToken) return res.status(401).json({message: "User not authorized"});
            const userToken:any = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string);
            const token = await TokenService.findToken(refreshToken);
            if (!userToken || !token) return res.status(401).json({message: "User not authorized"});

            const user = await Users.findByPk(userToken.id);
            if(!user) return res.status(401).json({message: "User not found"});
            let payload:iTokenPayload = {
                id: user.id,
                email: user.email,
                isActivated: user.isActivated,
            };
            const {accessToken,refreshToken:refToken} = TokenService.generate(payload);

            await TokenService.saveToken(userToken.id, refToken);
            res.cookie('refreshToken', refToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure:true, sameSite: 'none'});

            return res.status(200).json({
                id:user.id,
                email:user.email,
                isActivated:user.isActivated,
                accessToken,
                refreshToken,
            });
        }catch (e) {
            res.status(400).json({message:"Error: Can't refresh token"});
        }
    }
    public async getUsers(req: Request, res: Response, next:NextFunction) {
        try{
            const users = await Users.findAll({
                attributes: ['id','email','isActivated']
            });
            return res.status(200).json(users);
        }catch (e) {
            res.status(400).json({message:"Error: Can't get users"});
        }
    }
}

export default new AuthController();