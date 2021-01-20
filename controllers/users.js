const User = require("../database/schemas/User");
const { getSessionUser } = require("../utilities");

exports.session = (req, res) => {
    const { user } = req.session;

    res.json({ user, isAuthenticated: !!user });
};

exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const data = { username, email, password };
        const user = await User.createUser(data);
        const sessionUser = getSessionUser(user);

        req.session.user = sessionUser;
        res.status(200).json({
            message: "Account successfully created.",
            user: sessionUser,
            isAuthenticated: true,
        });
    } catch (e) {
        next(e);
    }
};

exports.login = (req, res) => {
    const { user } = res.locals;
    const sessionUser = getSessionUser(user);

    req.session.user = sessionUser;
    res.status(200).json({
        message: "Successfully logged in.",
        user: sessionUser,
        isAuthenticated: true,
    });
};

exports.logout = (req, res, next) => {
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
    } catch (e) {
        next(e);
    }
};
