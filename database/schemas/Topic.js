const { Schema, model } = require("mongoose");

const TopicSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
});

module.exports = model("Topic", TopicSchema);
