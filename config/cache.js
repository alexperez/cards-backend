const memjs = require("memjs");
const { MEMCACHIER_SERVERS } = process.env;

const cache = memjs.Client.create(MEMCACHIER_SERVERS, {
    failover: true,
    timeout: 1,
    keepAlive: true,
});

module.exports = cache;
