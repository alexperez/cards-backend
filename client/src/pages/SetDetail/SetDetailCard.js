import React from "react";
import { Flex, Box } from "@chakra-ui/react";

const cardStyles = {
    py: 3,
    border: "1px solid",
    borderColor: "gray.200",
    justifyContent: "space-between",
    height: "100%",
    flexDirection: { base: "column", md: "row" },
};

const SetDetailCard = ({ front, back }) => (
    <Flex {...cardStyles}>
        <Box
            px={3}
            width={{ md: "50%" }}
            borderRight={{ md: "1px solid" }}
            borderColor={{ md: "gray.200" }}
            mb={{ base: 4, md: 0 }}
        >
            {front}
        </Box>
        <Box px={3} width={{ md: "50%" }}>
            {back}
        </Box>
    </Flex>
);

export default SetDetailCard;
