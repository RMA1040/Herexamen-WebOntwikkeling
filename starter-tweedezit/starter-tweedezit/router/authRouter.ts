import express from "express";
import * as jwt from 'jsonwebtoken';
import {User} from "../types";
import { loginMiddleware } from "../middleware/jwtMiddleware";

export default function loginRouter() {
    const router = express.Router();

    router.get("/login", (req, res) => {
        res.render("login");
    });

    router.post("/login", async(req, res) => {
        const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "1d" });
        res.cookie("jwt", token, { httpOnly: true, sameSite: "lax", secure: true });
        res.redirect("/");
    });

    router.get("/logout", loginMiddleware, (req, res) => {
        res.clearCookie("jwt");
        res.redirect("/login");
    });

    router.get("/register", (req, res) => {
    });

    router.post("/register", async(req, res) => {

    });

    return router;
}