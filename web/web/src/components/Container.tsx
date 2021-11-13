import { Flex, useColorMode, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "./../pages/login";
import FullPageSpinner from "./rootComponents/FullPageSpinner";
import { useLogedInTestQuery } from "./../generated/graphql";
import { useRouter } from "next/dist/client/router";
import { routesWithRoles } from "./../utils/auth/authOptions";
import { getMainPageFromFullPath } from "./../helpers/generalUtilitiesFunctions";
import { useUser } from "./../helpers/hooks/useUser";
interface ContainerProps {}

export const Container: React.FC<ContainerProps> = ({ children }) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.50", dark: "gray.700" };
    const color = { light: "black", dark: "white" };
    const _user = useUser();
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

        // console.log("url: ", getMainPageFromFullPath(router.asPath));

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
        } else {
            // This not work because same thing above, the request does not update,
            // so a admin log in in this browser session, the cache-and-network will not
            // update fast enouth to get the correct role from current user,
            // this error should be corrected with cache-exchange of urql, if
            // only some queries can use it, it will be corrected in the future.

            //  : THE USER SHOULD COME FROM THE QUERIE NOT FROM LOCALSTORAGE!
            // const user = JSON.parse(loginTest?.data?.logedInTest?.result);

            routesWithRoles.map((route) => {
                if (route.route === getMainPageFromFullPath(router.asPath)) {
                    if (!route.roles.includes(_user.role.toLowerCase())) {
                        toast({
                            title: "Your Role can not access this page",
                            description: `Your role: ${_user.role}, cannot access the page ${router.asPath}`,
                            status: "warning",
                            duration: 8000,
                            isClosable: true,
                            position: "bottom-right",
                        });
                        router.push("/");
                    }
                }
            });
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
