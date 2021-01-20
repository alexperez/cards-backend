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
            maxlength: 200,
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
        },
        cards: {
            type: [FlashcardSchema],
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

SetSchema.path("cards").validate(function(val) {
    const cardLimit = 30;
    
    if (!Array.isArray(val)) {
        throw new Error("Set cards must be an array.");
    } else if (this.isNew && val.length === 0) {
        throw new Error("Set must have at least one card.");
    } else if (val.length > cardLimit) {
        throw new Error(`Each set can have a max of ${cardLimit} flashcards.`);
    }

    return true;
}, "Set validation cards error");

module.exports = model("Set", SetSchema);
