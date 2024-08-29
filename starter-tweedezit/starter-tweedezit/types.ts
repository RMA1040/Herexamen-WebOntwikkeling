import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    username: string;
    password: string;
    role: "USER" | "ADMIN";
}

export interface Series {
    _id?: ObjectId;
    title: string;
    url: string;
    description: string;
    rating: number;
    genre: string;
}