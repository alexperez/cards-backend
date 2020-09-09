const { Schema, model } = require("mongoose");

const TopicSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
});

TopicSchema.set("toJSON", { getters: true });

TopicSchema.options.toJSON.transform = (_, ret) => {
    const obj = { ...ret };
    delete obj._id;
    delete obj.__v;
    return obj;
};

module.exports = model("Topic", TopicSchema);
