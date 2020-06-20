const indexRouter = require("express").Router();
const User = require("../database/schemas/User");
const authValidator = require("../middlewares/validators/auth");
const { getSessionUser } = require("../utilities");
const {
    rateLimiterMongo,
    maxConsecutiveFailsByUsername,
} = require("../config/rate-limit");

indexRouter.get("/session", (req, res) => res.json(req.session.user));

indexRouter.post("/signup", authValidator, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const data = { username, email, password };
        const user = await User.createUser(data);
        const sessionUser = getSessionUser(user);

        req.session.user = sessionUser;
        res.status(200).json({
            message: "Account successfully created.",
            ...sessionUser,
        });
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

indexRouter.post("/login", authValidator, async (req, res) => {
    try {
        const { username, password } = req.body;
        const rlResUsername = await rateLimiterMongo.get(username);

        if (
            rlResUsername !== null &&
            rlResUsername.consumedPoints > maxConsecutiveFailsByUsername
        ) {
            const retrySecs =
                Math.round(rlResUsername.msBeforeNext / 1000) || 1;

            res.set("Retry-After", String(retrySecs));
            res.status(429).json({ message: "Too many requests." });
        } else {
            const { user, error } = await User.authenticate(username, password);

            if (!user) {
                try {
                    await rateLimiterMongo.consume(username);
                    const { message } = error;

                    res.status(400).json({ message });
                } catch (e) {
                    if (e instanceof Error) {
                        throw e;
                    } else {
                        const retrySecs =
                            Math.round(e.msBeforeNext / 1000) || 1;

                        res.set("Retry-After", String(retrySecs));
                        res.status(429).json({ message: "Too many requests." });
                    }
                }
            }

            if (user) {
                if (
                    rlResUsername !== null &&
                    rlResUsername.consumedPoints > 0
                ) {
                    await rateLimiterMongo.delete(username);
                }

                const sessionUser = getSessionUser(user);

                req.session.user = sessionUser;
                res.status(200).json({
                    message: "Successfully logged in.",
                    ...sessionUser,
                });
            }
        }
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

indexRouter.post("/logout", async (req, res) => {
    try {
        const { user } = req.session;

        if (user) {
            req.session.destroy((e) => {
                if (e) throw e;

                res.clearCookie(process.env.SESSION_NAME);
                res.status(200).send({
                    message: "Successfully logged out.",
                });
            });
        } else {
            throw new Error("No user found.");
        }
    } catch ({ message }) {
        res.status(422).json({ message });
    }
});

module.exports = indexRouter;
