const mongoose = require("mongoose");
const { MONGODB_URI } = require("../config");

module.exports = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        };

        await mongoose.connect(MONGODB_URI, options);
        console.log("Successfully connected to MongoDB!");

        return mongoose.connection;
    } catch (e) {
        console.error(e);
    }
};
