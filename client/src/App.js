import React from "react";
import { Switch, withRouter } from "react-router-dom";
import { routes, RoutesWithSubRoutes } from "config/routes";
import Layout from "components/Layout";
import Nav from "components/Nav";

const App = () => (
    <Layout>
        <Nav />

        <Switch>
            {routes.map((route) => (
                <RoutesWithSubRoutes key={route.key} {...route} />
            ))}
        </Switch>
    </Layout>
);

export default withRouter(App);
