const path = require("path");
const router = require("express").Router();

const users = require("./controllers/users");
const sets = require("./controllers/sets");

const amw = require("./middlewares/auth");
const smw = require("./middlewares/sets");

router.get("/session", users.session);
router.post("/signup", amw.validatorRules(), amw.validator, users.signup);
router.post("/login", amw.rateLimiter, users.login);
router.post("/logout", users.logout);

router.param("set", sets.load);
router.get("/sets", sets.queryAll, sets.list);
router.get("/sets/t/:topic", sets.queryByTopic, sets.list);
router.post(
    "/sets",
    amw.isAuthenticated,
    smw.validatorRules(),
    smw.validator,
    sets.create
);
router.get("/sets/:set", sets.show);
router.put(
    "/sets/:set",
    amw.isAuthenticated,
    amw.setsAuth,
    smw.validatorRules(false),
    smw.validator,
    sets.update
);
router.delete("/sets/:set", amw.isAuthenticated, amw.setsAuth, sets.delete);

router.get("/users/:username", sets.queryByUser, sets.list);

module.exports = (app) => {
    app.use("/api", router);

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client/build/index.html"));
    });

    app.use(({ name, message }, req, res, next) => {
        if (name === "CastError") {
            return res.status(400).json({ message: "Invalid document id." });
        }

        res.status(500).json({ message });
    });
};
