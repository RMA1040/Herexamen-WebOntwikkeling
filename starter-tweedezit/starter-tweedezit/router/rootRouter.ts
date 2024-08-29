import express from "express";
import { getSeries, getUsers } from "../database";
import { User, Series } from "../types";

export default function rootRouter() {
    const router = express.Router();

    router.get("/", async(req, res) => {
        res.render("index");
    });

    router.post("/delete/:id", async(req, res) => {
        res.redirect("/");
    })

    return router;
}