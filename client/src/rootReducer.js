import { combineReducers } from "redux";
import auth from "slice/auth";

const rootReducer = combineReducers({
    auth,
});

export default rootReducer;