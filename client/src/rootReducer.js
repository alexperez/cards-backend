import { combineReducers } from "redux";
import auth from "slice/auth";
import sets from "slice/sets";

const rootReducer = combineReducers({
    auth,
    sets,
});

export default rootReducer;
