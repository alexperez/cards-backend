import React from "react";
import PropTypes from "prop-types";
import { Box, CSSReset, ChakraProvider } from "@chakra-ui/react";
import theme from "config/theme";

const styles = {
    mx: "auto",
    mb: 16,
    width: "90%",
    maxWidth: "1180px",
};

const Layout = ({ children }) => (
    <ChakraProvider theme={theme}>
        <Box {...styles}>{children}</Box>
    </ChakraProvider>
);

Layout.propTypes = {
    children: PropTypes.node,
};

export default Layout;
