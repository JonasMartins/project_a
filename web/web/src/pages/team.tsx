import {
    Box,
    Flex,
    IconButton,
    Image,
    Link,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AiFillBell, AiFillEdit, AiOutlineEye } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import { useQuery } from "urql";
import { GlobalContext } from "../context/globalContext";
import { getServerPathImage } from "../utils/handleServerImagePaths";
import { Container } from "./../components/Container";
import SideBar from "./../components/layout/SideBar";
import ModalCreateUpdateViewTeams from "./../components/modal/ModalCreateUpdateViewTeams";
import FlexSpinner from "./../components/rootComponents/FlexSpinner";
import Footer from "./../components/rootComponents/Footer";
import Navbar from "./../components/rootComponents/Navbar";
import { GetTeamsDocument } from "./../generated/graphql";
import { generalContext, teamGetTeamsType } from "./../utils/generalGroupTypes";
import ModalCreateTeamsNews from "./../components/modal/ModalCreateTeamsNews";

interface TeamProps {}

const Team: React.FC<TeamProps> = () => {
    const { expanded } = useContext(GlobalContext);
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("50px");
    const [context, setContext] = useState<generalContext>("view");
    const [teams, setTeams] = useState<Array<teamGetTeamsType>>([]);
    const [selectedTeam, setSelectedTeam] = useState<teamGetTeamsType | null>(
        null
    );
    const [countUpdate, setCountUpdate] = useState(0);
    const updatedCallback = (value: number): void => {
        setCountUpdate(value);
    };

    const _modalCreateUpdateViewTeam = useDisclosure();
    const _modalCreateNotification = useDisclosure();

    const customOpenModal = (): void => {
        _modalCreateUpdateViewTeam.onOpen();
    };

    const [teamsQuery, reexecuteQuery] = useQuery({
        query: GetTeamsDocument,
    });

    const refreshGetTeams = useCallback(() => {
        reexecuteQuery({
            requestPolicy: "network-only",
        });
    }, []);

    useEffect(() => {
        if (teamsQuery.fetching) return;

        reexecuteQuery({
            requestPolicy: "cache-and-network",
        });

        if (teamsQuery.data?.getTeams?.teams) {
            setTeams(teamsQuery.data?.getTeams?.teams);
        }

        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3em");
            setNavBarWidth("50px");
        }
    }, [expanded, teamsQuery.fetching]);

    useEffect(() => {
        refreshGetTeams();

        if (teamsQuery.data?.getTeams?.teams) {
            setTeams(teamsQuery.data?.getTeams?.teams);
        }
    }, [countUpdate]);

    useEffect(() => {
        return () => {
            setSelectedTeam(null);
        };
    }, []);

    const content = (
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
                <Flex flexDir="row" alignItems="center" p={2}>
                    <NextLink href={"/"}>
                        <Link>
                            <Text>Home</Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>
                    <NextLink href={"/team"}>
                        <Link>
                            <Text>Teams</Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>
                </Flex>
                <Text p={2} fontSize="lg" fontWeight="semibold" ml={2}>
                    Teams
                </Text>
                <Flex p={2} m={2} justifyContent="flex-end">
                    <Tooltip
                        hasArrow
                        aria-label="Add new Team"
                        label="Add a new Team"
                        colorScheme="withe"
                    >
                        <IconButton
                            isRound={true}
                            aria-label="Add new Team"
                            variant="cyan-gradient"
                            mr={1}
                            icon={<GrAdd />}
                            onClick={() => {
                                setContext("create");
                                customOpenModal();
                                setSelectedTeam(null);
                            }}
                        />
                    </Tooltip>
                </Flex>
                {teams.length ? (
                    <Flex p={2} m={2}>
                        <Table size="sm">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Description</Th>
                                    <Th>Leader</Th>
                                    <Th>Details</Th>
                                    <Th>Edit</Th>
                                    <Th>News</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {teams.map((team) => (
                                    <Tr key={team.id}>
                                        <Td>{team.name}</Td>
                                        <Td>{team.description}</Td>
                                        <Td>
                                            {
                                                <Tooltip
                                                    hasArrow
                                                    aria-label={
                                                        team.leader.name
                                                    }
                                                    label={team.leader.name}
                                                    colorScheme="withe"
                                                >
                                                    <Image
                                                        boxSize="40px"
                                                        borderRadius="full"
                                                        src={getServerPathImage(
                                                            team.leader.picture
                                                        )}
                                                    />
                                                </Tooltip>
                                            }
                                        </Td>
                                        <Td>
                                            <Tooltip
                                                hasArrow
                                                aria-label="See Team details"
                                                label="See Team details"
                                                colorScheme="withe"
                                            >
                                                <IconButton
                                                    isRound={true}
                                                    aria-label="Team Details"
                                                    mr={1}
                                                    icon={<AiOutlineEye />}
                                                    onClick={() => {
                                                        setContext("view");
                                                        customOpenModal();
                                                        setSelectedTeam(team);
                                                    }}
                                                />
                                            </Tooltip>
                                        </Td>
                                        <Td>
                                            <Tooltip
                                                hasArrow
                                                aria-label="Edit team"
                                                label="Edit team"
                                                colorScheme="withe"
                                            >
                                                <IconButton
                                                    isRound={true}
                                                    aria-label="Edit Team"
                                                    variant="ghost"
                                                    mr={1}
                                                    icon={<AiFillEdit />}
                                                    onClick={() => {
                                                        setContext("update");
                                                        customOpenModal();
                                                        setSelectedTeam(team);
                                                    }}
                                                />
                                            </Tooltip>
                                        </Td>
                                        <Td>
                                            <Tooltip
                                                hasArrow
                                                aria-label="Create Notification to all team's members."
                                                label="Create Notification to all team's members."
                                                colorScheme="white"
                                            >
                                                <IconButton
                                                    isRound={true}
                                                    aria-label="Create Notification"
                                                    colorScheme="red"
                                                    mr={1}
                                                    icon={<AiFillBell />}
                                                    onClick={
                                                        _modalCreateNotification.onOpen
                                                    }
                                                />
                                            </Tooltip>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Flex>
                ) : (
                    <FlexSpinner />
                )}
            </Flex>
            <Box id="footer">
                <Footer />
            </Box>
            <ModalCreateUpdateViewTeams
                context={context}
                isOpen={_modalCreateUpdateViewTeam.isOpen}
                onClose={_modalCreateUpdateViewTeam.onClose}
                team={selectedTeam}
                countUpdate={countUpdate}
                updateCallback={updatedCallback}
            />
            <ModalCreateTeamsNews
                isOpen={_modalCreateNotification.isOpen}
                onClose={_modalCreateNotification.onClose}
                team={selectedTeam}
            />
        </Container>
    );

    return content;
};

export default Team;
