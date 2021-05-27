import React from "react";
import { Text as ChakraText } from "@chakra-ui/react";

const validUsernameCheck = (val) => {
    const trimmed = val.trim();
    const isValidUsername = /^[a-z0-9_]{1,}$/gim.test(trimmed);
    const invalidUsernameMessage =
        "Username may only contain letters, numbers or underscores.";

    return isValidUsername || invalidUsernameMessage;
};

const Text = ({ isValid, children }) => {
    const colors = {
        success: "green.500",
        error: "red.500",
    };

    return (
        <ChakraText as="span" color={isValid ? colors.success : colors.error}>
            {children}
        </ChakraText>
    );
};

const validPasswordCheck = (val) => {
    const hasLowerCaseLetter = /[a-z]/.test(val);
    const hasCapitalLetter = /[A-Z]/.test(val);
    const hasNumber = /\d/.test(val);

    const message = (
        <>
            Password must contain at least{" "}
            <Text isValid={hasLowerCaseLetter}>one lowercase letter</Text>
            {", "}
            <Text isValid={hasNumber}>one number</Text> and{" "}
            <Text isValid={hasCapitalLetter}>one capital letter</Text>.
        </>
    );

    return (hasLowerCaseLetter && hasCapitalLetter && hasNumber) || message;
};

export { validUsernameCheck, validPasswordCheck };
