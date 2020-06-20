const {
    NODE_ENV,
    PORT,
    MONGODB_PROD,
    MONGODB_DEV,
    SESSION_NAME,
    SESSION_SECRET,
} = process.env;

module.exports = {
    NODE_ENV,
    PORT,
    MONGODB_URI: NODE_ENV === "production" ? MONGODB_PROD : MONGODB_DEV,
    SESSION_NAME,
    SESSION_SECRET,
};
