import {
    Box,
    Flex,
    Link,
    Text,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Image,
    Tooltip,
    IconButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/globalContext";
import { Container } from "./../components/Container";
import SideBar from "./../components/layout/SideBar";
import Footer from "./../components/rootComponents/Footer";
import Navbar from "./../components/rootComponents/Navbar";
import { useGetTeamsQuery } from "./../generated/graphql";
import { teamGetTeamsType } from "./../utils/generalGroupTypes";
import FlexSpinner from "./../components/rootComponents/FlexSpinner";
import { getServerPathImage } from "../utils/handleServerImagePaths";
import { AiOutlineEye, AiFillEdit } from "react-icons/ai";

interface TeamProps {}

const Team: React.FC<TeamProps> = () => {
    const { expanded } = useContext(GlobalContext);
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("50px");

    const [teams, setTeams] = useState<Array<teamGetTeamsType>>([]);

    const [teamsQuery] = useGetTeamsQuery();

    useEffect(() => {
        if (teamsQuery.fetching) return;

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
                {teams.length ? (
                    <Flex p={2} m={2}>
                        <Table variant="striped" size="sm">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Description</Th>
                                    <Th>Leader</Th>
                                    <Th>Details</Th>
                                    <Th>Edit</Th>
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
        </Container>
    );

    return content;
};

export default Team;
