const router = require("express").Router();

const users = require("./controllers/users");
const topics = require("./controllers/topics");
const sets = require("./controllers/sets");

const auth = require("./middlewares/auth");

router.get("/session", users.session);
router.post("/signup", auth.authValidatorRules(), auth.authValidator, users.signup);
router.post("/login", auth.rateLimiter, users.login);
router.post("/logout", users.logout);

router.get("/topics", topics.list);

router.param("set", sets.load);
router.get("/sets", sets.queryAll, sets.list);
router.get("/sets/t/:topic", sets.queryTopic, sets.list);
router.post("/sets", auth.isAuthenticated, sets.create);
router.get("/sets/:set", sets.show);
router.put("/sets/:set", auth.isAuthenticated, auth.setsAuth, sets.update);
router.delete("/sets/:set", auth.isAuthenticated, auth.setsAuth, sets.delete);

module.exports = (app) => {
    app.use("/api", router);

    app.get("*", (req, res) => {
        res.status(404).json({ message: "Not found." });
    });

    app.use(({ name, message }, req, res, next) => {
        if (name === "CastError") {
            return res.status(400).json({ message: "Invalid document id." });
        }

        res.status(500).json({ message });
    });
};
