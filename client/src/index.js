import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "./store";
import history from "config/history";
import showToast from "config/toast";
import { verifyUser } from "slice/auth";
import App from "./App";

// Check if a user session exists
const handleVerifyUser = async () => {
    const resultAction = await store.dispatch(verifyUser());
    const { message } = resultAction.payload;

    if (verifyUser.rejected.match(resultAction)) {
        showToast("error", message);
    }
};

handleVerifyUser();

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById("root")
);
