import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { Series, User } from "./types";
import bcrypt from "bcrypt";
dotenv.config();

const saltRounds : number = 10;
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
export const client = new MongoClient(MONGODB_URI);
export const userCollection = client.db("login-express").collection<User>("users");
export const collection : Collection<Series> = client.db("series").collection<Series>("series");

function seedDatabase() {
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function connect() {
    await createInitialUsers();
    await client.connect();
    console.log("Connected to database");
    process.on("SIGINT", exit);
}

async function createInitialUsers() {
    if (await userCollection.countDocuments() > 0) {
        return;
    }
    let username : string | undefined = process.env.ADMIN_EMAIL;
    let password : string | undefined = process.env.ADMIN_PASSWORD;
    if (username === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await userCollection.insertMany({
        username: username,
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN"
    });
}

export async function getSeries() {
    return await collection.find({}).toArray();
}

export async function loadSeries(){
    const series : Series[] = await getSeries();
    if (series.length == 0) {
        console.log("Database is empty, loading series from API")
        const response = await fetch("https://raw.githubusercontent.com/similonap/json/master/series.json");
        const series : Series[] = await response.json();
        await collection.insertMany(series);
    }
}

export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await userCollection.find<User>({username: username});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

export async function getUsers() {
    return await collection.find({}).toArray();
}

export async function deleteSeries(_id: number) {
        return await collection.deleteOne({id: _id});
}


export async function getNextId() {
    let users : User[] = await collection.find({}).sort({_id: -1}).limit(1).toArray();
    if (users.length == 0) {
        return 1;
    } else {
        return users[0]._id + 1;
    }
}

export async function createUser(user: User) {
    user._id = await getNextId();
    return await collection.insertOne(user);
}
