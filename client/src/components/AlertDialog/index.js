import React from "react";
import {
    AlertDialog as ChakraAlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
} from "@chakra-ui/react";

const AlertDialog = ({ isOpen, leastDesctructiveRef, onClose, onCancel }) => (
    <ChakraAlertDialog
        isOpen={isOpen}
        leastDestructiveRef={leastDesctructiveRef}
        onClose={onCancel}
    >
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Set
                </AlertDialogHeader>

                <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={leastDesctructiveRef} onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button colorScheme="red" onClick={onClose} ml={3}>
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </ChakraAlertDialog>
);

export default AlertDialog;
