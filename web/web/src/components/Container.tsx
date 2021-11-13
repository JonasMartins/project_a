import { Flex, useColorMode, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "./../pages/login";
import FullPageSpinner from "./rootComponents/FullPageSpinner";
import { useLogedInTestQuery } from "./../generated/graphql";
import { useRouter } from "next/dist/client/router";

interface ContainerProps {}

export const Container: React.FC<ContainerProps> = ({ children }) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.50", dark: "gray.700" };
    const color = { light: "black", dark: "white" };

    const toast = useToast();
    const router = useRouter();
    const [loginTest, reexecuteQuery] = useLogedInTestQuery();

    useEffect(() => {
        reexecuteQuery({ requestPolicy: "cache-and-network" });
        if (loginTest?.fetching) return;

        handleRedirect();
    }, [loginTest.fetching]);

    const handleRedirect = () => {
        if (loginTest.fetching) return;

        if (loginTest?.data?.logedInTest?.errors) {
            if (
                typeof window !== "undefined" &&
                !localStorage.getItem("token")
            ) {
                toast({
                    title: "Not Authorized",
                    description: "Please Log in to access this page",
                    status: "error",
                    duration: 8000,
                    isClosable: true,
                    position: "bottom-right",
                });
                router.push("/login");
            }
        }
    };

    const content = loginTest.fetching ? (
        <FullPageSpinner />
    ) : (
        <Flex
            direction="column"
            bg={bgColor[colorMode]}
            color={color[colorMode]}
        >
            {children}
        </Flex>
    );

    return loginTest?.data?.logedInTest?.errors ? <Login /> : content;
};
