import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export function loginMiddleware(req: Request, res: Response, next: NextFunction) {
    let token : string = req.cookies.jwt;
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            res.redirect("/login");
        } else {
            console.log(user);
            res.locals.user = user;
            next();
        }
    });
};