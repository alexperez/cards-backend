const validator = require("../config/validator");

const authValidator = (req, res, next) => {
    const validationRules = {
        username: "required|string",
        email: "required|email|string",
        password: "required|string|min:6|strict",
    };

    validator(req.body, validationRules, (e, status) => {
        if (!status) {
            const { errors } = e;

            return res.status(400).json({
                message: "Signup validation failed.",
                errors,
            });
        }

        next();
    });
};

module.exports = authValidator;
