const { body, validationResult } = require("express-validator");
const { errorFormatter } = require("../shared");

const cardLimit = 30;

exports.validatorRules = (isNew = true) => [
    body("title", "Title is required.").exists(),
    body("title", "Title cannot exceed character limit of 100.").isLength({
        max: 100,
    }),
    body("cards", "Set cards must be an array.").custom((value) => Array.isArray(value)),
    body("cards", "Set must have at least one card.").custom((set) =>
        isNew ? set.length !== 0 : true
    ),
    body("cards", `Each set can have a max of ${cardLimit} flashcards.`).custom(
        (set) => set.length < cardLimit
    ),
    body("cards.*.front", "Card 'front' cannot exceed character limit of 250.").isLength({
        max: 250,
    }),
    body("card.*.back", "Card 'back' cannot exceed character limit of 250.").isLength({
        max: 250,
    }),
    body("topic", "Topic is required.").exists(),
];

exports.validator = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Set validation failed.",
            errors: errors.array(),
        });
    }

    next();
};
