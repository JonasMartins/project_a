import React, { useContext, useState } from "react";
import {
    Box,
    useColorMode,
    Text,
    Flex,
    Link,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import {
    AiOutlineApartment,
    AiOutlineOrderedList,
    AiOutlineProject,
    AiOutlineHome,
    AiOutlineExpandAlt,
} from "react-icons/ai";
import NextLink from "next/link";
import { RiAdminLine, RiTeamLine } from "react-icons/ri";
import { GlobalContext } from "./../../context/globalContext";
import { CgMinimizeAlt } from "react-icons/cg";

interface SideBarProps {}

const SideBar: React.FC<SideBarProps> = () => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.800" };
    const color = { light: "black", dark: "white" };

    const { expanded, _setExpanded } = useContext(GlobalContext);
    const [iconExpanded, setIconExpanded] = useState<Boolean>(expanded);

    const contractedContent = () => {
        return (
            <Flex
                justifyContent="flex-start"
                flexDir="column"
                mt={3}
                overflowY="hidden"
                overflowX="hidden"
                transition="0.5s"
            >
                <Tooltip
                    hasArrow
                    aria-label="Home"
                    label="Home"
                    colorScheme="withe"
                    placement="right"
                >
                    <Flex mb={5} alignItems="center">
                        <NextLink href="/">
                            <Link textStyle="bold">
                                <Flex alignItems="center">
                                    <AiOutlineHome size="20px" />
                                </Flex>
                            </Link>
                        </NextLink>
                    </Flex>
                </Tooltip>
                <Tooltip
                    hasArrow
                    aria-label="Sprints"
                    label="Sprints"
                    colorScheme="withe"
                    placement="right"
                >
                    <Flex mb={5} alignItems="center">
                        <NextLink href="/sprints">
                            <Link textStyle="bold">
                                <Flex alignItems="center">
                                    <AiOutlineApartment size="20px" />
                                </Flex>
                            </Link>
                        </NextLink>
                    </Flex>
                </Tooltip>
                <Tooltip
                    hasArrow
                    aria-label="Backlog"
                    label="Backlog"
                    colorScheme="withe"
                    placement="right"
                >
                    <Flex mb={5} alignItems="center">
                        <NextLink href="/backlog">
                            <Link textStyle="bold">
                                <Flex alignItems="center">
                                    <AiOutlineOrderedList size="20px" />
                                </Flex>
                            </Link>
                        </NextLink>
                    </Flex>
                </Tooltip>
                <Tooltip
                    hasArrow
                    aria-label="Projects"
                    label="Projects"
                    colorScheme="withe"
                    placement="right"
                >
                    <Flex mb={5} alignItems="center">
                        <NextLink href="/project">
                            <Link textStyle="bold">
                                <Flex alignItems="center">
                                    <AiOutlineProject size="20px" />
                                </Flex>
                            </Link>
                        </NextLink>
                    </Flex>
                </Tooltip>
                <Tooltip
                    hasArrow
                    aria-label="Teams"
                    label="Teams"
                    colorScheme="withe"
                    placement="right"
                >
                    <Flex mb={5} alignItems="center">
                        <NextLink href="/team">
                            <Link textStyle="bold">
                                <Flex alignItems="center">
                                    <RiTeamLine size="20px" />
                                </Flex>
                            </Link>
                        </NextLink>
                    </Flex>
                </Tooltip>
                <Tooltip
                    hasArrow
                    aria-label="Manage"
                    label="Manage"
                    colorScheme="withe"
                    placement="right"
                >
                    <Flex mb={5} alignItems="center">
                        <NextLink href="/manage">
                            <Link textStyle="bold">
                                <Flex alignItems="center">
                                    <RiAdminLine size="20px" />
                                </Flex>
                            </Link>
                        </NextLink>
                    </Flex>
                </Tooltip>
            </Flex>
        );
    };

    const expandedContent = () => {
        return (
            <Flex
                justifyContent="flex-start"
                flexDir="column"
                mt={3}
                overflowY="hidden"
                overflowX="hidden"
                transition="0.5s"
            >
                <Flex mb={5} alignItems="center">
                    <NextLink href="/">
                        <Link textStyle="bold">
                            <Flex alignItems="center">
                                <AiOutlineHome size="35px" />
                                <Text ml={2}>Home</Text>
                            </Flex>
                        </Link>
                    </NextLink>
                </Flex>
                <Flex mb={5} alignItems="center">
                    <NextLink href="/sprints">
                        <Link textStyle="bold">
                            <Flex alignItems="center">
                                <AiOutlineApartment size="35px" />
                                <Text ml={2}>Sprints</Text>
                            </Flex>
                        </Link>
                    </NextLink>
                </Flex>
                <Flex mb={5} alignItems="center">
                    <NextLink href="/backlog">
                        <Link textStyle="bold">
                            <Flex alignItems="center">
                                <AiOutlineOrderedList size="35px" />
                                <Text ml={2}>Backlog</Text>
                            </Flex>
                        </Link>
                    </NextLink>
                </Flex>
                <Flex mb={5} alignItems="center">
                    <NextLink href="/project">
                        <Link textStyle="bold">
                            <Flex alignItems="center">
                                <AiOutlineProject size="35px" />
                                <Text ml={2}> Projects</Text>
                            </Flex>
                        </Link>
                    </NextLink>
                </Flex>

                <Flex mb={5} alignItems="center">
                    <NextLink href="/team">
                        <Link textStyle="bold">
                            <Flex alignItems="center">
                                <RiTeamLine size="35px" />

                                <Text ml={2}>Teams</Text>
                            </Flex>
                        </Link>
                    </NextLink>
                </Flex>

                <Flex mb={5} alignItems="center">
                    <NextLink href="/manage">
                        <Link textStyle="bold">
                            <Flex alignItems="center">
                                <RiAdminLine size="35px" />

                                <Text ml={2}>Manage</Text>
                            </Flex>
                        </Link>
                    </NextLink>
                </Flex>
            </Flex>
        );
    };
    const content = (
        <Box
            h="100%"
            overflowY="hidden"
            overflowX="hidden"
            transition="0.5s"
            w={expanded ? "16em" : "50px"}
            bg={bgColor[colorMode]}
            color={color[colorMode]}
            boxShadow="xl"
            position="fixed"
            mt="0px"
            // borderRight="2px"
            // borderRightColor={colorMode === "light" ? "gray.200" : "grey.700"}
        >
            <Flex p={0} mt={2} flexDirection="column" alignItems="center">
                <Flex mb={5} alignItems="center">
                    <Tooltip
                        hasArrow
                        aria-label="Expand/Minimize side bar"
                        label="Expand/Minimize side bar"
                        colorScheme="withe"
                        placement="right"
                    >
                        <IconButton
                            isRound={true}
                            aria-label="Show Side Bar"
                            size="sm"
                            icon={
                                iconExpanded ? (
                                    <CgMinimizeAlt />
                                ) : (
                                    <AiOutlineExpandAlt />
                                )
                            }
                            onClick={() => {
                                setIconExpanded(!iconExpanded);
                                _setExpanded(!expanded);
                            }}
                        />
                    </Tooltip>
                </Flex>
                {expanded ? expandedContent() : contractedContent()}
            </Flex>
        </Box>
    );

    return content;
};

export default SideBar;
