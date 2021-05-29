import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Heading,
    Text,
    Tag,
    Link,
    LinkBox,
    LinkOverlay,
    Stack,
} from "@chakra-ui/react";

const cardStyles = {
    p: 4,
    border: "1px solid",
    borderColor: "gray.500",
};

const SetPreviewCard = ({ set }) => (
    <LinkBox {...cardStyles} _hover={{ borderColor: "gray.200" }}>
        <Heading
            fontSize="2xl"
            isTruncated
            _hover={{ textDecoration: "underline" }}
        >
            <LinkOverlay as={RouterLink} to={`/sets/${set.id}`}>
                {set.title}
            </LinkOverlay>
        </Heading>
        <Text fontSize="sm" textColor="gray.500">
            <Link as={RouterLink} to={`/${set.user.username}`}>
                {set.user.username}
            </Link>{" "}
            &#8226; {set.cards.length} cards
        </Text>

        <Stack direction="row" mt={6}>
            <Tag size="sm">#{set.topic}</Tag>
            {!set.public && (
                <Tag colorScheme="red" size="sm">
                    Private
                </Tag>
            )}
        </Stack>
    </LinkBox>
);

export default SetPreviewCard;
