import {
    createStandaloneToast,
    Alert,
    AlertTitle,
    AlertIcon,
    AlertDescription,
    CloseButton,
} from "@chakra-ui/react";
import List from "components/List";

const toast = createStandaloneToast();

const alertStyles = {
    maxWidth: "400px",
    mx: "auto",
    mb: 8,
    flexDirection: "column",
    alignItems: "start",
    padding: 5,
};

const btnStyles = {
    position: "absolute",
    right: "4px",
    top: "4px",
};

const showToast = (status, message, body = null) =>
    toast({
        duration: 2000,
        position: "top",
        render: ({ onClose }) => (
            <Alert status={status} {...alertStyles} variant="solid">
                <AlertTitle paddingRight="12px">
                    <AlertIcon
                        position="relative"
                        top="-2px"
                        display="inline-block"
                    />
                    {message}
                </AlertTitle>

                {body && (
                    <AlertDescription marginTop={2}>
                        {Array.isArray(body) ? (
                            <List styleType="desc" items={body} />
                        ) : (
                            body
                        )}
                    </AlertDescription>
                )}
                <CloseButton {...btnStyles} onClick={onClose} />
            </Alert>
        ),
    });

export default showToast;
