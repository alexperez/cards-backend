const mongoose = require("mongoose");
const { RateLimiterMongo } = require("rate-limiter-flexible");

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

const rlSlowBruteByIP = new RateLimiterMongo({
    storeClient: mongoose.connection,
    keyPrefix: "login_fail_ip_per_day",
    points: maxWrongAttemptsByIPperDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24,
});

const rlConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
    storeClient: mongoose.connection,
    keyPrefix: "login_fail_consecutive_username_and_ip",
    points: maxConsecutiveFailsByUsernameAndIP,
    duration: 60 * 60 * 24 * 90,
    blockDuration: 60 * 60,
});

module.exports = {
    rlSlowBruteByIP,
    rlConsecutiveFailsByUsernameAndIP,
    maxWrongAttemptsByIPperDay,
    maxConsecutiveFailsByUsernameAndIP,
};
