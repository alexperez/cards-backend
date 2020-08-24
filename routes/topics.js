const topicsRouter = require("express").Router();
const Topic = require("../database/schemas/Topic");
const cache = require("../config/cache");

topicsRouter.get("/", (req, res) => {
    try {
        const cacheKey = "topics";

        cache.get(cacheKey, async (err, buffer) => {
            let topics;

            if (err) throw err;

            if (buffer) {
                topics = JSON.parse(buffer);
            } else {
                topics = await Topic.find({}).exec();

                cache.set(
                    cacheKey,
                    JSON.stringify(topics),
                    { expires: 60 * 60 * 24 },
                    (err) => {
                        if (err) throw err;
                    }
                );
            }

            res.status(200).json({ topics });
        });
    } catch ({ message }) {
        res.status(500).json({ message });
    }
});

module.exports = topicsRouter;
