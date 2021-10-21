import {
    Box,
    Flex,
    Link,
    Table,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FcWorkflow } from "react-icons/fc";
import SideBar from "../../components/layout/SideBar";
import { Container } from "./../../components/Container";
import Footer from "./../../components/rootComponents/Footer";
import { GlobalContext } from "./../../context/globalContext";
import Navbar from "./../../components/rootComponents/Navbar";
import React, { useEffect, useState, useContext } from "react";
import { useGetProjectsQuery } from "./../../generated/graphql";
import FullPageSpinner from "./../../components/rootComponents/FullPageSpinner";

interface projectsProps {}

const Project: React.FC<projectsProps> = ({}) => {
    const { expanded } = useContext(GlobalContext);

    const [{ data, fetching, error }, reexecuteQuery] = useGetProjectsQuery({
        variables: {
            limit: 5,
        },
        pause: true,
    });

    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("50px");

    useEffect(() => {
        if (fetching) return;
        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3em");
            setNavBarWidth("50px");
        }
        reexecuteQuery({ requestPolicy: "cache-first" });
    }, [fetching, expanded, reexecuteQuery]);

    if (error) return <p>Oh no... {error.message}</p>;

    const loading = <FullPageSpinner />;
    const content = (
        <>
            <Container>
                <Navbar pageWidth={navBarWidth} />
                <SideBar />

                <Flex flexDir="column" ml={pageWidth} transition="0.3s">
                    <Flex p={2} flexDir="row" alignItems="center" ml={2}>
                        <NextLink href={"/"}>
                            <Link>
                                <Text>Home</Text>
                            </Link>
                        </NextLink>
                        <Text color="gray.500" ml={2} mr={2}>
                            {">"}
                        </Text>

                        <NextLink href={"/project"}>
                            <Link>
                                <Text>Project</Text>
                            </Link>
                        </NextLink>
                        <Text color="gray.500" ml={2} mr={2}>
                            {">"}
                        </Text>
                    </Flex>
                    <Flex p={2} mb="150px">
                        <Table size="lg" variant="striped">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Description</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data &&
                                    data.getProjects.map((project) => (
                                        <Tr key={project.id}>
                                            <Td>
                                                <Flex>
                                                    <FcWorkflow size={"20px"} />
                                                    <NextLink
                                                        href={`/project/${project.id}`}
                                                    >
                                                        <Link>
                                                            <Text
                                                                fontSize="lg"
                                                                pl={2}
                                                            >
                                                                {project.name}
                                                            </Text>
                                                        </Link>
                                                    </NextLink>
                                                </Flex>
                                            </Td>
                                            <Td>
                                                {project.description &&
                                                project.description.length >
                                                    20 ? (
                                                    <Text fontSize="lg">
                                                        {project.description.substr(
                                                            0,
                                                            20
                                                        ) + "..."}
                                                    </Text>
                                                ) : (
                                                    <Text fontSize="lg">
                                                        {project.description.substr(
                                                            0,
                                                            20
                                                        )}
                                                    </Text>
                                                )}
                                            </Td>
                                        </Tr>
                                    ))}
                            </Tbody>
                            <Tfoot>
                                <Tr>
                                    <Th></Th>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </Flex>
                </Flex>
                <Box id="footer">
                    <Footer />
                </Box>
            </Container>
        </>
    );
    return fetching ? loading : content;
};

export default Project;
