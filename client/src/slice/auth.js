import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "config/api";

const initialState = {
    user: undefined,
    isAuthenticated: false,
    init: "idle",
    loading: "idle",
    currentRequestId: undefined,
};

export const verifyUser = createAsyncThunk(
    "auth/verifyUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/session");
            return res.data;
        } catch ({ response }) {
            return rejectWithValue({ message: response.statusText });
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (formValues, { rejectWithValue }) => {
        try {
            const res = await axios.post("/signup", formValues);
            return res.data;
        } catch ({ response }) {
            if (response.data) {
                const { message, errors } = response.data;
                return rejectWithValue({ message, body: errors });
            } else {
                return rejectWithValue({ message: response.statusText });
            }
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (formValues, { rejectWithValue }) => {
        try {
            const res = await axios.post("/login", formValues);
            return res.data;
        } catch ({ response }) {
            const message = response.data.message || response.statusText;
            return rejectWithValue({ message });
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.post("/logout");
            const { message } = res.data;
            return { ...initialState, message };
        } catch ({ response }) {
            const message = response.data.message || response.statusText;
            return rejectWithValue({ message });
        }
    }
);

const getLoadingProp = (actionType) =>
    actionType.includes("verifyUser") ? "init" : "loading";

const pendingActionReducer = (state, { meta, type }) => {
    const loadingProp = getLoadingProp(type);

    if (state[loadingProp] === "idle") {
        state[loadingProp] = "pending";
        state.currentRequestId = meta.requestId;
    }
};

const fulfilledActionReducer = (state, { payload, meta, type }) => {
    const { requestId } = meta;
    const loadingProp = getLoadingProp(type);

    if (
        state[loadingProp] === "pending" &&
        state.currentRequestId === requestId
    ) {
        const { user, isAuthenticated } = payload;

        state[loadingProp] = "idle";
        state.user = user;
        state.isAuthenticated = isAuthenticated;
    }
};

const rejectedActionReducer = (state, { meta, type }) => {
    const { requestId } = meta;
    const loadingProp = getLoadingProp(type);

    if (
        state[loadingProp] === "pending" &&
        state.currentRequestId === requestId
    ) {
        state.user = undefined;
        state[loadingProp] = "idle";
        state.currentRequestId = undefined;
    }
};

const checkActionForThunks = (action, actionType) =>
    action.type.startsWith("auth") && action.type.endsWith(actionType);

const isPendingAction = (action) => checkActionForThunks(action, "pending");
const isFulfilledAction = (action) => checkActionForThunks(action, "fulfilled");
const isRejectedAction = (action) => checkActionForThunks(action, "rejected");

const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addMatcher(isPendingAction, pendingActionReducer)
            .addMatcher(isFulfilledAction, fulfilledActionReducer)
            .addMatcher(isRejectedAction, rejectedActionReducer);
    },
});

const { reducer } = authSlice;

export default reducer;
