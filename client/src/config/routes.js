import React from "react";
import { Route, Redirect } from "react-router-dom";
import PublicRoute from "components/PublicRoute";
import PrivateRoute from "components/PrivateRoute";
import Login from "pages/Login";
import Signup from "pages/Signup";
import NewSet from "pages/NewSet";
import Home from "pages/Home";
import SetList from "pages/SetList";
import SetDetail from "pages/SetDetail";

export const routes = [
    {
        path: "/404",
        key: "NOTFOUND",
        component: () => <div>Not found page</div>,
    },
    {
        path: "/login",
        key: "LOGIN",
        component: () => <PublicRoute component={Login} />,
    },
    {
        path: "/signup",
        key: "SIGNUP",
        component: () => <PublicRoute component={Signup} />,
    },
    {
        path: "/new",
        key: "NEW",
        component: () => <PrivateRoute component={NewSet} />,
    },
    {
        path: "/:userid",
        key: "USER",
        exact: true,
        component: () => <div>User page</div>,
    },
    {
        path: "/sets/:setid",
        key: "SETS/DETAIL",
        component: SetDetail,
    },
    {
        path: "/",
        key: "HOME",
        component: Home,
        routes: [
            {
                path: "/",
                key: "SETS",
                exact: true,
                component: SetList,
            },
            {
                path: "/topic/:topic",
                key: "SETS/TOPIC",
                component: SetList,
            },
            {
                path: "*",
                key: "NOTFOUNDREDIRECT",
                component: () => <Redirect to="/404" />,
            },
        ],
    },
];

export const RoutesWithSubRoutes = (route) => (
    <Route
        path={route.path}
        exact={route.exact}
        render={(props) => <route.component {...props} routes={route.routes} />}
    />
);
