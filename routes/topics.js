const topicsRouter = require("express").Router();
const Topic = require("../database/schemas/Topic");

topicsRouter.get("/", async (req, res) => {
    try {
        const topics = await Topic.find({}).exec();

        res.status(200).json({ topics });
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

module.exports = topicsRouter;
