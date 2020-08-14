const { authValidatorRules, authValidator } = require("./validator");
const rateLimiter = require("./rate-limit");

const isAuthenticated = (req, res, next) => {
    const { user } = req.session;

    if (!user) {
        return res.status(401).json({
            message: "Unauthorized.",
        });
    }

    next();
};

module.exports = {
    authValidatorRules,
    authValidator,
    rateLimiter,
    isAuthenticated,
};
