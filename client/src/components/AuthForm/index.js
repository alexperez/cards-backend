import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
    Box,
    Heading,
    Stack,
    Divider,
    Button,
    Text,
    Link as ChakraLink,
} from "@chakra-ui/react";

const formStyles = {
    mx: "auto",
    mt: 28,
    width: "100%",
    maxWidth: "400px",
};

const AuthForm = ({ heading, altRoute, children, onSubmit }) => (
    <Box as="form" {...formStyles} onSubmit={onSubmit}>
        <Stack spacing={6}>
            <Heading>{heading}</Heading>

            {children}

            <Button
                width="100%"
                colorScheme="gray"
                variant="outline"
                type="submit"
            >
                {heading}
            </Button>

            <Divider />

            <Text textAlign="center">
                {altRoute.prompt}{" "}
                <ChakraLink as={Link} to={altRoute.to}>
                    {altRoute.linkText}
                </ChakraLink>
            </Text>
        </Stack>
    </Box>
);

AuthForm.propTypes = {
    heading: PropTypes.string,
    altRoute: PropTypes.shape({
        to: PropTypes.string,
        prompt: PropTypes.string,
        linkText: PropTypes.string,
    }),
    children: PropTypes.node,
    onSubmit: PropTypes.func,
};

export default AuthForm;
