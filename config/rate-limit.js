const mongoose = require("mongoose");
const { RateLimiterMongo } = require("rate-limiter-flexible");

const maxConsecutiveFailsByUsername = 5;
const options = {
    storeClient: mongoose.connection,
    points: maxConsecutiveFailsByUsername,
    duration: 7200,
    blockDuration: 900,
};

const rateLimiterMongo = new RateLimiterMongo(options);

module.exports = {
    rateLimiterMongo,
    maxConsecutiveFailsByUsername,
};
