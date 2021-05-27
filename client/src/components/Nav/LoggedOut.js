import React from "react";
import { Link } from "react-router-dom";
import { ButtonGroup, Button } from "@chakra-ui/react";

const LoggedOut = () => (
    <ButtonGroup>
        <Button as={Link} to="/login" colorScheme="gray" variant="ghost">
            Login
        </Button>
        <Button as={Link} to="/signup" colorScheme="gray" variant="ghost">
            Sign Up
        </Button>
    </ButtonGroup>
);

export default LoggedOut;
