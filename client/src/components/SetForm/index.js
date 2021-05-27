import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
    Heading,
    Stack,
    ButtonGroup,
    Button,
    FormLabel,
    Switch,
    Box,
} from "@chakra-ui/react";
import topics from "config/topics";
import Input from "../form/Input";
import Select from "../form/Select";
import CardFormContainer from "./CardFormContainer";

const formStyles = {
    display: { base: "block", md: "flex" },
    mb: 16,
};

const SetForm = ({ isNew, onSubmit, onCancel, set }) => {
    const defaultCards = [
        { front: "", back: "" },
        { front: "", back: "" },
    ];

    const defaultValues = {
        title: set?.title,
        topic: set?.topic,
        cards: set?.cards || defaultCards,
        public: set?.public,
    };

    const { errors, register, handleSubmit, control } = useForm({
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "cards",
    });

    return (
        <Box as="form" {...formStyles} onSubmit={handleSubmit(onSubmit)}>
            <Box w={{ md: "40%" }}>
                <Stack spacing={6} shouldWrapChildren>
                    <Heading>{isNew ? "Create New Set" : "Edit Set"}</Heading>

                    <Input
                        error={errors.title}
                        placeholder="Set title"
                        name="title"
                        ref={register({
                            maxLength: {
                                value: 100,
                                message: "Max title length: 100.",
                            },
                            required: "Title is required.",
                        })}
                    />

                    <Select
                        error={errors.topic}
                        options={topics}
                        name="topic"
                        placeholder="Select topic"
                        ref={register({ required: "Topic is required." })}
                    />

                    <fieldset>
                        <FormLabel htmlFor="set-toggle">
                            Public Set (toggle to allow anyone to view this set)
                        </FormLabel>
                        <Switch
                            id="set-toggle"
                            name="public"
                            size="md"
                            ref={register}
                        />
                    </fieldset>

                    <ButtonGroup>
                        <Button
                            colorScheme="gray"
                            variant="outline"
                            type="submit"
                        >
                            {isNew ? "Create set" : "Update set"}
                        </Button>
                        {!isNew && <Button onClick={onCancel}>Cancel</Button>}
                    </ButtonGroup>
                </Stack>
            </Box>
            <CardFormContainer
                cards={fields}
                errors={errors}
                register={register}
                append={append}
                remove={remove}
                isNew={isNew}
            />
        </Box>
    );
};

export default SetForm;
