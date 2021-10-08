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
    IconButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { FcWorkflow } from "react-icons/fc";
import { Container } from "./../../components/Container";
import Footer from "./../../components/rootComponents/Footer";
import FullPageSpinner from "./../../components/rootComponents/FullPageSpinner";
import Navbar from "./../../components/rootComponents/Navbar";
import { useGetProjectsQuery } from "./../../generated/graphql";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import SideBar from "../../components/layout/SideBar";

interface projectsProps {}

const Project: React.FC<projectsProps> = ({}) => {
    const [{ data, fetching, error }, reexecuteQuery] = useGetProjectsQuery({
        variables: {
            limit: 5,
        },
        pause: true,
    });

    const [expand, setExpand] = useState(true);
    const [sideBarWidth, setSideBarWidth] = useState("0px");
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("0px");

    const handleExpandSideBar = (): void => {
        setExpand(!expand);

        if (expand) {
            setSideBarWidth("250px");
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setSideBarWidth("0px");
            setPageWidth("3em");
            setNavBarWidth("0px");
        }
    };

    useEffect(() => {
        if (fetching) return;
        reexecuteQuery({ requestPolicy: "cache-first" });
    }, [fetching, reexecuteQuery]);

    if (error) return <p>Oh no... {error.message}</p>;

    const loading = <FullPageSpinner />;
    const content = (
        <>
            <Container>
                <Navbar pageWidth={navBarWidth} />
                <SideBar
                    width={sideBarWidth}
                    visibility={expand ? "hidden" : "visible"}
                />

                <Flex flexDir="column" ml={pageWidth} transition="0.3s">
                    <Flex p={2} flexDir="row" alignItems="center">
                        <Flex mt={2}>
                            <IconButton
                                isRound={true}
                                aria-label="Show Side Bar"
                                mr={1}
                                icon={
                                    expand ? (
                                        <ArrowLeftIcon />
                                    ) : (
                                        <ArrowRightIcon />
                                    )
                                }
                                onClick={handleExpandSideBar}
                            />
                        </Flex>
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
