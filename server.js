if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const initDB = require("./database");
const session = require("./config/session");

const app = express();

initDB()
    .then((dbConnection) => app.emit("ready", dbConnection))
    .catch(console.error);

app.on("ready", (dbConnection) => {
    app.set("trust proxy", true);
    app.use(express.static(path.join(__dirname, "client/build")));
    app.use(helmet());
    app.use(morgan("tiny"));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(session(dbConnection));

    require("./routes")(app);

    app.listen(process.env.PORT);
});
