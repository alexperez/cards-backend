import React from "react";
import PropTypes from "prop-types";
import {
    FormControl,
    Select as ChakraSelect,
    FormErrorMessage,
} from "@chakra-ui/react";
import { slugify } from "utils";

const Select = React.forwardRef(({ error, options, ...props }, ref) => (
    <FormControl isInvalid={error}>
        <ChakraSelect {...props} ref={ref}>
            {options.map((option, idx) => (
                <option key={idx} value={slugify(option)}>
                    {option}
                </option>
            ))}
        </ChakraSelect>
        {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
));

Select.propTypes = {
    errors: PropTypes.object,
    options: PropTypes.array.isRequired,
};

export default Select;
