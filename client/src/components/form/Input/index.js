import React from "react";
import PropTypes from "prop-types";
import {
    FormControl,
    Input as ChakraInput,
    FormErrorMessage,
} from "@chakra-ui/react";

const Input = React.forwardRef(({ error, ...props }, ref) => (
    <FormControl isInvalid={error}>
        <ChakraInput {...props} ref={ref} variant="outline" />
        <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
));

Input.propTypes = {
    errors: PropTypes.object,
};

export default Input;
