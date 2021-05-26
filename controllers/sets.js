const Set = require("../database/schemas/Set");
const User = require("../database/schemas/User");

const queryPublicOrUser = (user) => ({
    $or: [{ public: true }, { user: user && user.id }],
});

exports.queryAll = (req, res, next) => {
    const { user } = req.session;
    res.locals.query = queryPublicOrUser(user);

    next();
};

exports.queryByTopic = (req, res, next) => {
    const { user } = req.session;
    const { topic } = req.params;

    res.locals.query = {
        $and: [{ topic }, queryPublicOrUser(user)],
    };

    next();
};

exports.queryByUser = async (req, res, next) => {
    try {
        const { user } = req.session;
        const { username } = req.params;
        const userDoc = await User.findOne({ username });

        if (!userDoc) {
            return res.status(404).json({ message: "User not found." });
        }

        res.locals.query = {
            $and: [{ user: userDoc.id }, queryPublicOrUser(user)],
        };

        next();
    } catch (e) {
        throw e;
    }
};

exports.list = async (req, res, next) => {
    try {
        const { query } = res.locals;
        const sets = await Set.find(query)
            .populate("user", "id, username")
            .sort({ createdAt: -1 })
            .limit(20)
            .exec();

        res.status(200).json({ sets });
    } catch (e) {
        next(e);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { title, public, topic, cards } = req.body;
        const {
            user: { id },
        } = req.session;

        const set = new Set({ title, public, user: id, cards, topic });
        await set.save();

        res.status(200).json({ message: "Set successfully created.", set });
    } catch (e) {
        next(e);
    }
};

exports.load = async (req, res, next, id) => {
    try {
        const { user } = req.session;
        const set = await Set.findOne({
            $and: [{ _id: id }, queryPublicOrUser(user)],
        }).populate("user", "id, username");

        if (!set) return res.status(404).json({ message: "Set not found." });

        res.locals.set = set;
        next();
    } catch (e) {
        next(e);
    }
};

exports.show = (req, res, next) => {
    const { set } = res.locals;
    res.status(200).json({ set });
};

exports.update = async (req, res, next) => {
    try {
        const { set } = res.locals;
        const { title, public, cards, topic } = req.body;

        set.title = title;
        set.public = public;
        set.cards = cards;
        set.topic = topic;

        await set.save();

        res.status(200).json({ message: "Set updated successfully.", set });
    } catch (e) {
        next(e);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const { set } = res.locals;
        await Set.deleteOne(set);

        res.status(200).json({ message: "Set deleted successfully." });
    } catch (e) {
        next(e);
    }
};
