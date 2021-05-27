import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ ...props }) => {
    const { auth } = useSelector(({ auth }) => ({ auth }));
    const { isAuthenticated, init } = auth;

    if (init === "pending") return null;

    return isAuthenticated ? <Route {...props} /> : <Redirect to="/login" />;
};

export default PrivateRoute;
