import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Flex, Box } from "@chakra-ui/react";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import logo from "./logo.svg";

const navStyles = {
    mt: 8,
    mb: 16,
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
};

const Nav = () => {
    const { auth } = useSelector(({ auth }) => ({ auth }));
    const { user, isAuthenticated, init } = auth;

    return (
        <Flex as="nav" {...navStyles}>
            <Flex alignItems="center">
                <Link to="/">
                    <img src={logo} alt="Cards logo" width="70px" />
                </Link>
            </Flex>

            {init === "idle" && (
                <Box>
                    {isAuthenticated ? <LoggedIn user={user} /> : <LoggedOut />}
                </Box>
            )}
        </Flex>
    );
};

export default Nav;
