import { useGetProjectsQuery } from "./../../generated/graphql";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    Flex,
    Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import FlexSpinner from "./../../components/rootComponents/FlexSpinner";
import { Container } from "./../../components/Container";
import Navbar from "./../../components/rootComponents/Navbar";
import Footer from "./../../components/rootComponents/Footer";
import { FaCodeBranch } from "react-icons/fa";

interface projectsProps {}

const Project: React.FC<projectsProps> = ({}) => {
    const [{ data, fetching, error }, reexecuteQuery] = useGetProjectsQuery({
        variables: {
            limit: 5,
        },
        pause: true,
    });

    useEffect(() => {
        if (fetching) return;
        reexecuteQuery({ requestPolicy: "cache-first" });
    }, [fetching, reexecuteQuery]);

    if (error) return <p>Oh no... {error.message}</p>;

    const loading = <FlexSpinner />;
    const content = (
        <>
            <Container>
                <Navbar />

                <Flex p={2} m={2}>
                    <Table size="lg">
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
                                                <FaCodeBranch size={"20px"} />
                                                <Text fontSize="lg" pl={2}>
                                                    {project.name}
                                                </Text>
                                            </Flex>
                                        </Td>
                                        <Td>
                                            {project.description &&
                                            project.description.length > 20 ? (
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

                <Box id="footer">
                    <Footer />
                </Box>
            </Container>
        </>
    );
    return fetching ? loading : content;
};

export default Project;
