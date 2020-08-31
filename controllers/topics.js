const Topic = require("../database/schemas/Topic");
const cache = require("../config/cache");

exports.list = (req, res, next) => {
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
                    { expires: 60 * 60 * 24 * 20 },
                    (err) => {
                        if (err) throw err;
                    }
                );
            }

            res.status(200).json({ topics });
        });
    } catch (e) {
        next(e);
    }
};
