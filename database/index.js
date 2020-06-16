const mongoose = require("mongoose");

(async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        };

        await mongoose.connect(process.env.MONGODB_DEV, options);
        console.log("Successfully connected to MongoDB!");
    } catch (e) {
        console.error(e);
    }
})();

module.exports = mongoose.connection;
