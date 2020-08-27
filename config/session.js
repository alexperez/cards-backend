const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const { NODE_ENV, SESSION_NAME, SESSION_SECRET } = process.env;

module.exports = (dbConnection) =>
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
    });
