import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const PublicRoute = ({ ...props }) => {
    const { auth } = useSelector(({ auth }) => ({ auth }));
    const { isAuthenticated, init } = auth;

    if (init === "pending") return null;

    return isAuthenticated ? <Redirect to="/" /> : <Route {...props} />;
};

export default PublicRoute;
