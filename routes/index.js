const indexRouter = require("express").Router();
const User = require("../database/schemas/User");
const authValidator = require("../validators/users");
const { getSessionUser } = require("../utilities/helpers");

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
        const user = await User.authenticate(username, password);

        if (user) {
            const sessionUser = getSessionUser(user);

            req.session.user = sessionUser;
            res.send({
                message: "Successfully logged in.",
                ...sessionUser,
            });
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
