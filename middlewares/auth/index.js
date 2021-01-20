const { authValidatorRules, authValidator } = require("./validator");
const rateLimiter = require("./rate-limit");

exports.isAuthenticated = (req, res, next) => {
    const { user } = req.session;

    if (!user) {
        return res.status(401).json({
            message: "Unauthorized.",
        });
    }

    next();
};

exports.setsAuth = (req, res, next) => {
    const { user } = req.session;
    const { set } = res.locals;

    if (set.user.id === user.id || user.admin) return next();

    res.status(401).json({ message: "Unauthorized." });
};

exports.authValidatorRules = authValidatorRules;
exports.authValidator = authValidator;
exports.rateLimiter = rateLimiter;
