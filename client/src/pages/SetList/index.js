import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Spinner, Center, SimpleGrid } from "@chakra-ui/react";
import showToast from "config/toast";
import { getAllSets } from "slice/sets";
import SetPreviewCard from "./SetPreviewCard";

const SetList = () => {
    const { sets, auth } = useSelector(({ sets, auth }) => ({ sets, auth }));
    const dispatch = useDispatch();
    const { topic } = useParams();
    const { sets: data, loading } = sets;
    const { user } = auth;

    const handleGetAllSets = (topic) => {
        try {
            dispatch(getAllSets(topic));
        } catch ({ name, message }) {
            if (name !== "ConditionError") {
                showToast("error", message);
            }
        }
    };

    useEffect(() => handleGetAllSets(topic), [topic, user]);

    if (loading === "pending")
        return (
            <Center>
                <Spinner mt={16} size="xl" />
            </Center>
        );

    return (
        <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} spacing={8}>
            {data.map((set) => (
                <SetPreviewCard key={set.id} set={set} />
            ))}
        </SimpleGrid>
    );
};

export default SetList;
