import React, { useState, useEffect, useContext } from "react";
import { Container } from "../components/Container";
import Navbar from "../components/rootComponents/Navbar";
import SideBar from "../components/layout/SideBar";
import { formatDistance } from "date-fns";
import {
    Flex,
    Text,
    Link,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Tooltip,
    IconButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { GlobalContext } from "../context/globalContext";
import { useGetSprintsQuery } from "./../generated/graphql";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import { GrAdd } from "react-icons/gr";

interface SprintProps {}

const Sprint: React.FC<SprintProps> = () => {
    const { expanded } = useContext(GlobalContext);
    const [navBarWidth, setNavBarWidth] = useState("0px");

    const [pageWidth, setPageWidth] = useState("3em");

    const [sprints] = useGetSprintsQuery({
        variables: {
            active: true,
            limit: 5,
        },
    });

    useEffect(() => {
        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3em");
            setNavBarWidth("0px");
        }
    }, [expanded]);

    const content = sprints.fetching ? (
        <FullPageSpinner />
    ) : (
        <Container>
            <Navbar pageWidth={navBarWidth} />
            <SideBar />
            <Flex
                alignSelf="normal"
                flexDir="column"
                flexGrow={1}
                mb="150px"
                ml={pageWidth}
                transition="0.3s"
            >
                <Flex flexDir="row" alignItems="center" p={2} ml={2}>
                    <NextLink href={"/"}>
                        <Link>
                            <Text>Home</Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>
                    <NextLink href={"/sprint"}>
                        <Link>
                            <Text>Sprints</Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>
                </Flex>
                <Text p={2} fontSize="lg" fontWeight="semibold" ml={2}>
                    Sprints
                </Text>
                <Flex p={2} m={2} justifyContent="flex-end">
                    {/* 
                    <Tooltip
                        hasArrow
                        aria-label="list disabled/enabled users"
                        label="List Enabled/Disabled users"
                        colorScheme="withe"
                    >
                        <Button
                            onClick={() => {
                                setActiveUsers(!activeUsers);
                            }}
                            mr={2}
                        >
                            {activeUsers ? "Disabled?" : "Activated?"}
                        </Button>
                    </Tooltip> */}
                    <Tooltip
                        hasArrow
                        aria-label="Add new sprint"
                        label="Add a new sprint"
                        colorScheme="withe"
                    >
                        <IconButton
                            isRound={true}
                            aria-label="Add new sprint"
                            variant="cyan-gradient"
                            mr={1}
                            icon={<GrAdd />}
                        />
                    </Tooltip>
                </Flex>
                <Flex p={2} mb="250px">
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Code</Th>
                                <Th>Project</Th>
                                <Th>Length</Th>
                                <Th>End</Th>
                                <Th>Active?</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {sprints?.data &&
                                sprints?.data?.getSprints?.map((sprint) => (
                                    <Tr key={sprint.id}>
                                        <Td>
                                            <Text fontSize="lg" pl={2}>
                                                {sprint.code}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <NextLink
                                                href={`/project/${sprint.project.id}`}
                                            >
                                                <Link>
                                                    <Text fontSize="lg" pl={2}>
                                                        {sprint.project.name}
                                                    </Text>
                                                </Link>
                                            </NextLink>
                                        </Td>
                                        <Td>
                                            <Text fontSize="lg" pl={2}>
                                                {sprint.length.toLocaleLowerCase() +
                                                    (sprint.length === "ONE"
                                                        ? " week"
                                                        : " weeks")}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text fontSize="lg" pl={2}>
                                                {formatDistance(
                                                    new Date(sprint.final),
                                                    new Date(),
                                                    { addSuffix: true }
                                                )}
                                            </Text>
                                        </Td>
                                        <Td>
                                            <Text fontSize="lg" pl={2}>
                                                {sprint.active ? "Yes" : "No"}
                                            </Text>
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </Flex>
            </Flex>
        </Container>
    );

    return content;
};

export default Sprint;
