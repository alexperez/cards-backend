const { Schema, model } = require("mongoose");

const TopicSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
});

TopicSchema.set("toJSON", { getters: true, virutals: true });

TopicSchema.options.toJSON.transform = (_, ret) => {
    const obj = { ...ret };
    delete obj._id;
    delete obj.__v;
    return obj;
};

TopicSchema.virtual("slug").get(function () {
    return this.name
        .split(" ")
        .map((w) => w.toLowerCase())
        .join("-");
});

module.exports = model("Topic", TopicSchema);
