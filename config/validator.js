const Validatorjs = require("validatorjs");

const validator = (body, rules, callback) => {
    const validation = new Validatorjs(body, rules);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

Validatorjs.register(
    "strict",
    (value) => passwordRegex.test(value),
    "Password must contain at least one uppercase letter, one lowercase letter and one number."
);

module.exports = validator;
