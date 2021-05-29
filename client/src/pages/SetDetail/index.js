import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
    Box,
    Tag,
    Spinner,
    Center,
    Heading,
    Text,
    Link,
    ButtonGroup,
    Button,
    Stack,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import showToast from "config/toast";
import { getSet, updateSet, deleteSet } from "slice/sets";
import history from "config/history";
import SetForm from "components/SetForm";
import AlertDialog from "components/AlertDialog";
import SetDetailCard from "./SetDetailCard";

const SetDetail = () => {
    const { sets, auth } = useSelector(({ sets, auth }) => ({ sets, auth }));
    const dispatch = useDispatch();
    const { setid } = useParams();
    const [isEditMode, toggleEditMode] = useState(false);
    const [isDialogOpen, toggleDialog] = useState(false);
    const cancelRef = useRef();
    const { set, loading } = sets;
    const { user } = auth;

    const handleGetSet = async (setid) => {
        try {
            const resultAction = await dispatch(getSet(setid));
            unwrapResult(resultAction);
        } catch ({ message }) {
            showToast("error", message);
            history.push("/404");
        }
    };

    const handleUpdateSet = async (data) => {
        try {
            const setData = { setid, ...data };
            const resultAction = await dispatch(updateSet(setData));
            const { message } = unwrapResult(resultAction);

            showToast("success", message);
            toggleEditMode(false);
        } catch ({ message, body }) {
            showToast("error", message, body);
        }
    };

    const handleDeleteSet = async (setid) => {
        try {
            const resultAction = await dispatch(deleteSet(setid));
            const { message } = unwrapResult(resultAction);

            showToast("success", message);
            history.push("/");
        } catch ({ message }) {
            showToast("error", message);
        }
    };

    useEffect(() => handleGetSet(setid), [setid]);

    if (!set || loading === "pending")
        return (
            <Center>
                <Spinner mt={16} size="xl" />
            </Center>
        );

    return isEditMode ? (
        <SetForm
            onSubmit={handleUpdateSet}
            onCancel={() => toggleEditMode(false)}
            set={set}
        />
    ) : (
        <>
            <Box mb={10}>
                <Heading size="2xl" mb={2}>
                    {set.title}
                </Heading>

                <Text fontSize="lg" textColor="gray.500">
                    <Link as={RouterLink} to={`/${set.user.username}`}>
                        {set.user.username}
                    </Link>{" "}
                    &#8226; {set.cards.length} cards
                </Text>

                <Stack direction="row" mt={4}>
                    <Tag size="sm">#{set.topic}</Tag>
                    {!set.public && (
                        <Tag colorScheme="red" size="sm">
                            Private
                        </Tag>
                    )}
                </Stack>

                {user && user.id === set.user.id && (
                    <ButtonGroup mt={4}>
                        <Button
                            leftIcon={<EditIcon />}
                            variant="outline"
                            size="sm"
                            onClick={() => toggleEditMode(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            leftIcon={<DeleteIcon />}
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            onClick={() => toggleDialog(true)}
                        >
                            Delete
                        </Button>
                    </ButtonGroup>
                )}
            </Box>

            <AlertDialog
                isOpen={isDialogOpen}
                leastDesctructiveRef={cancelRef}
                onClose={() => handleDeleteSet(set.id)}
                onCancel={() => toggleDialog(false)}
            />

            <Stack>
                {set.cards.map((card) => (
                    <SetDetailCard key={card.id} {...card} />
                ))}
            </Stack>
        </>
    );
};

export default SetDetail;
