import React from "react";
import { Box, CloseButton, Button, Stack } from "@chakra-ui/react";
import Input from "../form/Input";

const cardStyles = {
    border: "1px solid #c9c9c9",
    p: 4,
    mb: 4,
    position: "relative",
};

const btnStyles = {
    position: "absolute",
    top: "5px",
    right: "5px",
};

const cardCtnStyles = {
    w: { md: "60%" },
    mt: { base: 8, md: 0 },
    ml: { md: 8 },
};

const CardFormContainer = ({
    cards,
    errors,
    register,
    append,
    remove,
    isNew,
}) => (
    <Box {...cardCtnStyles}>
        {cards.map((card, idx) => (
            <Box {...cardStyles} key={card.id}>
                {idx < 2 && isNew ? null : (
                    <CloseButton {...btnStyles} onClick={() => remove(idx)} />
                )}
                <Stack spacing={6} shouldWrapChildren>
                    <span>Card {idx + 1}</span>

                    <Input
                        placeholder="Card front"
                        error={errors.cards?.[idx]?.front}
                        name={`cards[${idx}].front`}
                        ref={register({
                            maxLength: {
                                value: 250,
                                message: "Max card 'front' length: 250",
                            },
                            required: "Card 'front' is required.",
                        })}
                        defaultValue={card.front}
                    />
                    <Input
                        placeholder="Card back"
                        error={errors.cards?.[idx]?.back}
                        name={`cards[${idx}].back`}
                        ref={register({
                            maxLength: {
                                value: 250,
                                message: "Max card 'back' length: 250",
                            },
                            required: "Card 'back' is required.",
                        })}
                        defaultValue={card.back}
                    />
                </Stack>
            </Box>
        ))}

        {cards.length < 30 && (
            <Button
                colorScheme="gray"
                variant="ghost"
                onClick={() => append({ front: "", back: "" })}
            >
                &#43; Add card
            </Button>
        )}
    </Box>
);

export default CardFormContainer;
