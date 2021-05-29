import React from "react";
import PropTypes from "prop-types";
import { List as ChakraList, ListItem } from "@chakra-ui/react";

const List = ({ items, ...props }) => (
    <ChakraList {...props} stylePosition="inside">
        {items.map((item, idx) => (
            <ListItem key={idx}>{item}</ListItem>
        ))}
    </ChakraList>
);

List.propTypes = {
    items: PropTypes.array,
};

export default List;
