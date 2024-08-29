import app from "./app";
import { connect } from "./database";

app.listen(app.get("port"), async() => {
    console.log("Server started on http://localhost:" + app.get("port"));
});