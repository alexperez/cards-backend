if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const session = require("express-session");
const initDb = require("./database");
const MongoStore = require("connect-mongo")(session);

const { NODE_ENV, PORT, SESSION_NAME, SESSION_SECRET } = require("./config");

const authRouter = require("./routes/auth");
const topicsRouter = require("./routes/topics");

const app = express();

initDb().then((dbConnection) => {
    app.emit("ready", { dbConnection });
});

app.on("ready", ({ dbConnection }) => {
    app.set("trust proxy", 1);
    app.use(helmet());
    app.use(morgan("tiny"));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(
        session({
            name: SESSION_NAME,
            secret: SESSION_SECRET,
            saveUninitialized: false,
            resave: false,
            store: new MongoStore({
                mongooseConnection: dbConnection,
                ttl: 60 * 60 * 2,
                touchAfter: 60 * 60 * 24,
            }),
            cookie: {
                sameSite: true,
                secure: NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 2,
            },
        })
    );

    app.use("/auth", authRouter);
    app.use("/topics", topicsRouter);

    app.listen(PORT, () =>
        console.log(`Listening at http://localhost:${PORT}`)
    );
});
