const validator = require("../config/validator");
const { getValidatorErrors } = require("../utilities");

const authValidator = (req, res, next) => {
    const authRules = {
        username: "required|string",
        email: "required|email|string",
        password: "required|string|min:6|strict",
    };

    validator(req.body, authRules, (e, status) => {
        if (!status) {
            const { errors } = e;
            const validatorErrors = getValidatorErrors(errors);

            return res.status(400).json({
                message: "Signup validation failed.",
                errors: validatorErrors,
            });
        }

        next();
    });
};

module.exports = authValidator;
