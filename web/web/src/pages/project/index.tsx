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
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Link,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import NextLink from "next/link";
import FullPageSpinner from "./../../components/rootComponents/FullPageSpinner";
import { Container } from "./../../components/Container";
import Navbar from "./../../components/rootComponents/Navbar";
import Footer from "./../../components/rootComponents/Footer";
import { FcWorkflow } from "react-icons/fc";
import { ChevronRightIcon } from "@chakra-ui/icons";

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

    const loading = <FullPageSpinner />;
    const content = (
        <>
            <Container>
                <Navbar />
                <Flex p={2} margin="1em 2em 1em">
                    <Breadcrumb
                        separator={<ChevronRightIcon color="gray.500" />}
                    >
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/project">
                                Projects
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Flex>
                <Flex p={2} m={2}>
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
