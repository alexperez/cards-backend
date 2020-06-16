if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const session = require("express-session");
const dbConnection = require("./database");
const MongoStore = require("connect-mongo")(session);

const indexRouter = require("./routes");

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        store: new MongoStore({
            mongooseConnection: dbConnection,
            ttl: 2 * 60 * 60,
            touchAfter: 24 * 60 * 60,
        }),
        cookie: {
            sameSite: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7200000,
        },
    })
);

app.use("/", indexRouter);

app.listen(process.env.PORT, () =>
    console.log(`Listening at http://localhost:${process.env.PORT}`)
);
