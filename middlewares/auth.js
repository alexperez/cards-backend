const validator = require("../config/validator");

const messages = {
    "/signup": "Signup validation failed.",
    "/login": "Login validation failed.",
};

const authValidator = (req, res, next) => {
    const validationRules = {
        username: "required|string",
        password: "required|string|min:6|strict",
    };

    if (req.path === "/signup") {
        validationRules.email = "required|email|string";
    }

    validator(req.body, validationRules, (e, status) => {
        if (!status) {
            const { errors } = e;

            return res.status(400).json({
                message: messages[req.path],
                errors,
            });
        }

        next();
    });
};

module.exports = authValidator;
