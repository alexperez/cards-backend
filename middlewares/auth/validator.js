const { body, validationResult } = require("express-validator");
const blacklist = require("the-big-username-blacklist");
const { errorFormatter } = require("../shared");

exports.validatorRules = () => [
    body("username", "Username is required.")
        .trim()
        .exists({ checkFalsy: true }),
    body("username", "Username cannot exceed character limit of 40.").isLength({
        max: 40,
    }),
    body(
        "username",
        "Username may only contain letters, numbers or underscores."
    ).custom((value) => /^[a-z0-9_]{1,}$/gim.test(value)),
    body("username", "Username not available").custom((value) =>
        blacklist.validate(value)
    ),
    body("email", "Invalid email.").exists().normalizeEmail().isEmail(),
    body("password", "Password length must be at least 6 characters.")
        .exists()
        .isLength({ min: 6 }),
    body(
        "password",
        "Password must contain at least one uppercase letter, one lowercase letter and one number."
    ).custom((value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/.test(value)
    ),
];

exports.validator = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Signup validation failed.",
            errors: errors.array(),
        });
    }

    next();
};
