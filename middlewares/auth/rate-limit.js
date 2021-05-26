const requestIP = require("request-ip");
const User = require("../../database/schemas/User");
const {
    rlSlowBruteByIP,
    rlConsecutiveFailsByUsernameAndIP,
    maxWrongAttemptsByIPperDay,
    maxConsecutiveFailsByUsernameAndIP,
} = require("../../config/rate-limit");

const rateLimiter = async (req, res, next) => {
    try {
        const ipAddr = requestIP.getClientIp(req);
        const { login, password } = req.body;
        const lcLogin = login.toLowerCase();
        const usernameIPKey = `${lcLogin}_${ipAddr}`;

        const [resUsernameAndIP, resSlowByIP] = await Promise.all([
            rlConsecutiveFailsByUsernameAndIP.get(usernameIPKey),
            rlSlowBruteByIP.get(ipAddr),
        ]);

        let retrySecs = 0;

        // Check if IP or username + IP is already blocked
        if (
            resSlowByIP !== null &&
            resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
        ) {
            retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
        } else if (
            resUsernameAndIP !== null &&
            resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
        ) {
            retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
        }

        if (retrySecs > 0) {
            res.set("Retry-After", String(retrySecs));
            return res.status(429).json({ message: "Too many requests." });
        }

        const user = await User.authenticate(lcLogin, password);

        if (!user.isLoggedIn) {
            try {
                const promises = [rlSlowBruteByIP.consume(ipAddr)];

                if (user.exists) {
                    promises.push(
                        rlConsecutiveFailsByUsernameAndIP.consume(usernameIPKey)
                    );
                }

                await Promise.all(promises);

                const { message } = user.error;

                return res.status(400).json({ message });
            } catch (e) {
                if (e instanceof Error) {
                    throw e;
                } else {
                    res.set(
                        "Retry-After",
                        String(Math.round(e.msBeforeNext / 1000)) || 1
                    );
                    return res
                        .status(429)
                        .json({ message: "Too many requests." });
                }
            }
        }

        if (user.isLoggedIn) {
            if (
                resUsernameAndIP !== null &&
                resUsernameAndIP.consumedPoints > 0
            ) {
                await rlConsecutiveFailsByUsernameAndIP.delete(usernameIPKey);
            }

            res.locals.user = user.data;
            next();
        }
    } catch (e) {
        next(e);
    }
};

module.exports = rateLimiter;
