import React from "react";
import { Link, Switch, useLocation } from "react-router-dom";
import { Box, Button } from "@chakra-ui/react";
import { RoutesWithSubRoutes } from "config/routes";
import topics from "config/topics";
import { slugify } from "utils";

const Home = ({ routes }) => {
    const { pathname } = useLocation();

    return (
        <>
            <Box mb={10}>
                {["Recently Created", ...topics].map((topic, idx) => {
                    const path = idx === 0 ? "/" : `/topic/${slugify(topic)}`;

                    return (
                        <Button
                            as={Link}
                            to={path}
                            colorScheme="gray"
                            variant="outline"
                            mb={4}
                            mr={2}
                            key={topic}
                            borderColor={
                                pathname === path ? "gray.500" : "gray.200"
                            }
                        >
                            {topic}
                        </Button>
                    );
                })}
            </Box>
            <Switch>
                {routes.map((route) => (
                    <RoutesWithSubRoutes key={route.key} {...route} />
                ))}
            </Switch>
        </>
    );
};

export default Home;
