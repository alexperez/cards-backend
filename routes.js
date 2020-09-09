const router = require("express").Router();

const auth = require("./controllers/auth");
const topics = require("./controllers/topics");

router.get("/session", auth.session);
router.post("/signup", auth.authValidatorRules(), auth.authValidator, auth.signup);
router.post("/login", auth.rateLimiter, auth.login);
router.post("/logout", auth.logout);

router.get("/topics", topics.list);

module.exports = (app) => {
    app.use("/api", router);

    app.get("*", (req, res) => {
        res.status(404).json({ message: "Not Found." });
    });

    app.use(({ name, message }, req, res, next) => {
        if (name === "CastError") {
            return res.status(400).json({ message: "Invalid set id." });
        }

        res.status(500).json({ message });
    });
};
