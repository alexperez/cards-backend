import React from "react";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { logoutUser } from "slice/auth";
import showToast from "config/toast";

const newSetBtnStyles = {
    mr: 4,
    display: { base: "none", md: "inline-flex" },
};

const LoggedIn = ({ user }) => {
    const dispatch = useDispatch();

    const handleLogoutUser = async () => {
        try {
            const resultAction = await dispatch(logoutUser());
            const { message } = unwrapResult(resultAction);

            showToast("success", message);
        } catch ({ message }) {
            showToast("error", message);
        }
    };

    return (
        <>
            <Button
                as={Link}
                to="/new"
                colorScheme="gray"
                variant="ghost"
                {...newSetBtnStyles}
            >
                &#43; New Set
            </Button>
            <Menu>
                <MenuButton
                    as={Button}
                    leftIcon={<ChevronDownIcon />}
                    colorScheme="gray"
                    background="none"
                    borderWidth="1px"
                >
                    {user.username}
                </MenuButton>
                <MenuList>
                    <MenuItem as={Link} to="/">
                        Explore
                    </MenuItem>
                    <MenuItem as={Link} to={`/${user.username}`}>
                        Profile
                    </MenuItem>
                    <MenuItem as={Link} to={`/new`}>
                        New Set
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleLogoutUser}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </>
    );
};

export default LoggedIn;
