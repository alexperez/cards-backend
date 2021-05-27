import React from "react";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { createSet } from "slice/sets";
import history from "config/history";
import showToast from "config/toast";
import SetForm from "components/SetForm";

const NewSet = () => {
    const dispatch = useDispatch();

    const handleCreateSet = async (data) => {
        try {
            const resultAction = await dispatch(createSet(data));
            const { message, set } = unwrapResult(resultAction);

            showToast("success", message);
            history.push(`/sets/${set.id}`);
        } catch ({ message, body }) {
            showToast("error", message, body);
        }
    };

    return <SetForm onSubmit={handleCreateSet} isNew />;
};

export default NewSet;
