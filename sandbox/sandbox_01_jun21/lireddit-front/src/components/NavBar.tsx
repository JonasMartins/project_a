import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const Cyan400: string = "#0BC5EA";
    const Gray50: string = "#F7FAFC";

    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    });

    let body = <></>;

    if (fetching) {
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link textStyle="bold" textColor={Gray50} mr={2}>
                        Login
                    </Link>
                </NextLink>

                <NextLink href="/register">
                    <Link textStyle="bold" textColor={Gray50} mr={2}>
                        Register
                    </Link>
                </NextLink>
            </>
        );
    } else {
        body = (
            <Flex>
                <Box mr={2}>Welcome {data.me.username}</Box>
                <Button
                    onClick={() => {
                        logout();
                    }}
                    isLoading={logoutFetching}
                    ml={2}
                    variant="link"
                >
                    LogOut
                </Button>
            </Flex>
        );
    }

    return (
        <Flex bg={Cyan400} p={4}>
            <Box textStyle="bold" textColor={Gray50} ml={"auto"}>
                {body}
            </Box>
        </Flex>
    );
};
