import { createSlice, createAsyncThunk, isFulfilled } from "@reduxjs/toolkit";
import axios from "config/api";

const initialState = {
    sets: [],
    set: undefined,
    loading: "idle",
    currentRequestId: undefined,
};

export const createSet = createAsyncThunk(
    "sets/createSet",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post("/sets", data);
            return res.data;
        } catch ({ response }) {
            if (response.data) {
                const { message, errors } = response.data;
                return rejectWithValue({ message, body: errors });
            }

            return rejectWithValue({ message: response.statusText });
        }
    }
);

export const getSet = createAsyncThunk(
    "sets/getSet",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/sets/${id}`);
            return res.data;
        } catch ({ response }) {
            const message = response.data.message || response.statusText;
            return rejectWithValue({ message });
        }
    }
);

export const updateSet = createAsyncThunk(
    "sets/updateSet",
    async (data, { rejectWithValue }) => {
        try {
            const { setid, ...set } = data;
            const res = await axios.put(`/sets/${setid}`, set);
            return res.data;
        } catch ({ response }) {
            if (response.data) {
                const { message, errors } = response.data;
                return rejectWithValue({ message, body: errors });
            }
            return rejectWithValue({ message: response.statusText });
        }
    }
);

export const deleteSet = createAsyncThunk(
    "sets/deleteSet",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.delete(`/sets/${id}`);
            return res.data;
        } catch ({ response }) {
            const message = response.data.message || response.statusText;
            return rejectWithValue({ message });
        }
    }
);

export const getAllSets = createAsyncThunk(
    "sets/getAllSets",
    async (topic = "", { rejectWithValue }) => {
        try {
            const url = topic ? `/sets/t/${topic}` : `/sets`;
            const res = await axios.get(url);
            return res.data;
        } catch ({ response }) {
            return rejectWithValue({ message: response.statusText });
        }
    },
    {
        condition: (_, { getState }) => {
            const { sets } = getState();
            const fetchStatus = sets.loading;

            if (fetchStatus === "pending") {
                return false;
            }
        },
    }
);

const pendingActionReducer = (state, { meta }) => {
    if (state.loading === "idle") {
        state.loading = "pending";
        state.currentRequestId = meta.requestId;
    }
};

const rejectedActionReducer = (state, { meta }) => {
    const { requestId } = meta;

    if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle";
    }
};

const fulfilledSetActionReducer = (state, { payload, meta }) => {
    const { requestId } = meta;

    if (state.loading === "pending" && state.currentRequestId === requestId) {
        const { set } = payload;

        state.set = set;
        state.loading = "idle";
    }
};

const checkActionForThunks = (action, actionType) =>
    action.type.startsWith("sets") && action.type.endsWith(actionType);

const isPendingAction = (action) => checkActionForThunks(action, "pending");
const isRejectedAction = (action) => checkActionForThunks(action, "rejected");
const isFulfilledSetAction = isFulfilled(
    createSet,
    getSet,
    updateSet,
    deleteSet
);

const setsSlice = createSlice({
    name: "sets",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllSets.fulfilled, (state, { payload, meta }) => {
                if (
                    state.loading === "pending" &&
                    state.currentRequestId === meta.requestId
                ) {
                    const { sets } = payload;

                    state.sets = sets;
                    state.set = undefined;
                    state.loading = "idle";
                }
            })
            .addMatcher(isFulfilledSetAction, fulfilledSetActionReducer)
            .addMatcher(isPendingAction, pendingActionReducer)
            .addMatcher(isRejectedAction, rejectedActionReducer);
    },
});

const { reducer } = setsSlice;

export default reducer;
