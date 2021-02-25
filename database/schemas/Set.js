const { Schema, model } = require("mongoose");

const FlashcardSchema = new Schema({
    front: {
        type: String,
        required: true,
        maxlength: 250,
        trim: true,
    },
    back: {
        type: String,
        required: true,
        maxlength: 250,
        trim: true,
    },
});

FlashcardSchema.set("toJSON", { getters: true });

FlashcardSchema.options.toJSON.transform = (_, ret) => {
    const obj = { ...ret };
    delete obj._id;
    return obj;
};

const SetSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 100,
            trim: true,
        },
        public: {
            type: Boolean,
            required: true,
            default: false,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cards: {
            type: [FlashcardSchema],
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

SetSchema.post("save", async (doc, next) => {
    await doc.populate("user", "id, username").execPopulate();

    next();
});

SetSchema.set("toJSON", { getters: true });

SetSchema.options.toJSON.transform = (_, ret) => {
    const obj = { ...ret };
    delete obj._id;
    delete obj.__v;
    return obj;
};

module.exports = model("Set", SetSchema);
