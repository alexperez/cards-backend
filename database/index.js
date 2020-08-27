const mongoose = require("mongoose");
const { NODE_ENV, MONGODB_PROD, MONGODB_DEV } = process.env;
const MONGODB_URI = NODE_ENV === "production" ? MONGODB_PROD : MONGODB_DEV;

module.exports = () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        };

        mongoose.connect(MONGODB_URI, options);
        console.log("Successfully connected to MongoDB!");

        return mongoose.connection;
    } catch (e) {
        console.error(e);
    }
};
