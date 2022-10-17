import {Response,NextFunction} from "express";
import jwt from "jsonwebtoken";

export default function (req:any, res:Response, next:NextFunction) {
    try {
        if (!req.headers.authorization) throw 'User not authorized';
        const token = req.headers.authorization.split(' ')[1];
        if (!token) throw 'User not authorized';
        const user = jwt.verify(token, process.env.ACCESS_SECRET as string);
        if (!user) throw 'User not authorized';
        req.user = user;
        next();
    } catch (e) {
        res.status(401).json({message: 'User not authorized'});
    }
}