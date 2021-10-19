import React from "react";
import { Box, useColorMode, Text, Flex, Link } from "@chakra-ui/react";
import { SiCodesandbox } from "react-icons/si";
import {
    AiOutlineApartment,
    AiOutlineOrderedList,
    AiOutlineProject,
    AiOutlineHome,
} from "react-icons/ai";
import NextLink from "next/link";
import { RiAdminLine } from "react-icons/ri";
import { useUser } from "./../../helpers/hooks/useUser";

interface SideBarProps {
    projectName?: string;
    width: string;
    visibility: "visible" | "hidden";
}

const SideBar: React.FC<SideBarProps> = ({
    projectName,
    width,
    visibility,
}) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.50", dark: "gray.700" };
    const color = { light: "black", dark: "white" };

    const user = useUser();

    return (
        <Box
            h="100%"
            overflowY="hidden"
            overflowX="hidden"
            transition="0.3s"
            pt="5"
            w={width}
            bg={bgColor[colorMode]}
            color={color[colorMode]}
            boxShadow="lg"
            position="fixed"
            mt="0px"
        >
            <Flex
                visibility={visibility}
                p={2}
                mt={7}
                flexDirection="column"
                alignItems="center"
            >
                <Box mb={5}>
                    <SiCodesandbox size="35px" />
                </Box>
                {projectName && (
                    <React.Fragment>
                        <Text fontSize="2xl">{projectName}</Text>
                        <Text fontSize="lg">Software project</Text>{" "}
                    </React.Fragment>
                )}

                <Flex justifyContent="flex-start" flexDir="column" mt={3}>
                    <Flex mb={5} alignItems="center">
                        <AiOutlineHome size="35px" />
                        <NextLink href="/">
                            <Link textStyle="bold" ml={2}>
                                Home
                            </Link>
                        </NextLink>
                    </Flex>
                    <Flex mb={5} alignItems="center">
                        <AiOutlineApartment size="35px" />
                        <Text ml={2}>Active Sprints</Text>
                    </Flex>
                    <Flex mb={5} alignItems="center">
                        <AiOutlineOrderedList size="35px" />
                        <NextLink href="/backlog">
                            <Link textStyle="bold" ml={2}>
                                Backlog
                            </Link>
                        </NextLink>
                    </Flex>
                    <Flex mb={5} alignItems="center">
                        <AiOutlineProject size="35px" />
                        <NextLink href="/project">
                            <Link textStyle="bold" ml={2}>
                                Projects
                            </Link>
                        </NextLink>
                    </Flex>

                    {user && user.role === "Admin" ? (
                        <Flex mb={5} alignItems="center">
                            <RiAdminLine size="35px" />
                            <NextLink href="/manage">
                                <Link textStyle="bold" ml={2}>
                                    Manage
                                </Link>
                            </NextLink>
                        </Flex>
                    ) : (
                        <></>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};

export default SideBar;
