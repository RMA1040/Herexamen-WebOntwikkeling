import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import authRouter from "./router/authRouter";
import rootRouter from "./router/rootRouter";
import { loginMiddleware } from "./middleware/jwtMiddleware";
import { connect, getSeries, getUsers, createUser, deleteSeries } from "./database";
import { Series, User } from "./types";
dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());

app.use(authRouter());
app.use(rootRouter())
app.get("/", loginMiddleware, async(req, res) => {
    res.render("index");
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT ?? 3000);

//users READ
app.get("/users", async(req, res) => {
    let users : User[] = await getUsers();
    res.render("users/index", {
        users: users
    });
});

app.get("/users/create", async(req, res) => {
    res.render("users/create");
});

app.post("/users/create", async(req, res) => {
    let user : User = req.body;
    await createUser(user);
    res.redirect("/users");
});

// series
let series: Series[] = [];
app.get("/person",(req,res)=>{
    res.type("text/html")
    if (typeof req.query.index === "string") {
      let index = parseInt(req.query.index);
      res.send(series[index]);
    }
    else {
      res.send("Ongeldige parameterwaarde.");
    }
});

app.get("/", (req, res) => {
    let q : string = req.query.q ?? req.query.q : "";
    let filteredSeries: Series[] = series.filter((series) => {
        return series.title.toLowerCase().startsWith(q.toLowerCase());
    });
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "title";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
    let sortedPersons = [...series].sort((a, b) => {
        if (sortField === "name") {
            return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else {
            return 0;
        }
    });
    res.render("index", {
        persons: filteredSeries,
        q: q
    });
});


app.post("/series/:_id/delete", async(req, res) => {
    let _id : number = parseInt(req.params._id);
    await deleteSeries(_id);
    res.redirect("/series");
});

app.listen(app.get("port"), async() => {
    try {
        await connect();
        console.log("Server started on http://localhost:" + app.get('port'));
    } catch (e) {
        console.log(e);
        process.exit(1); 
    }
});
export default app;