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
    Tooltip,
    useDisclosure,
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
import { GrAdd } from "react-icons/gr";
import ModalCreateUpdateProject from "./../../components/modal/ModalCreateUpdateProject";
import { AiFillEdit } from "react-icons/ai";
import { projectType } from "./../../utils/generalGroupTypes";

interface projectsProps {}

type manageContext = "update" | "create";

const Project: React.FC<projectsProps> = ({}) => {
    const { expanded } = useContext(GlobalContext);

    const [{ data, fetching, error }, reexecuteQuery] = useGetProjectsQuery({
        variables: {
            limit: 5,
        },
    });

    const [context, setContext] = useState<manageContext>("update");
    const [countUpdate, setCountUpdate] = useState(0);
    const updatedCallback = (value: number): void => {
        setCountUpdate(value);
    };

    const [selectedProject, setSelectedProject] = useState<projectType | null>(
        null
    );

    const modalCreateUpdateProject = useDisclosure();

    const customOnOpenCreateUpdateProject = (): void => {
        modalCreateUpdateProject.onOpen();
    };

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
        reexecuteQuery({ requestPolicy: "cache-and-network" });
    }, [fetching, expanded, reexecuteQuery, countUpdate]);

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
                    <Text p={2} fontSize="lg" fontWeight="semibold" ml={2}>
                        Projects
                    </Text>
                    <Flex p={2} m={2} justifyContent="flex-end">
                        <Tooltip
                            hasArrow
                            aria-label="Add new project"
                            label="Add a new project"
                            colorScheme="withe"
                        >
                            <IconButton
                                isRound={true}
                                aria-label="Add new project"
                                variant="cyan-gradient"
                                mr={1}
                                icon={<GrAdd />}
                                onClick={() => {
                                    setContext("create");
                                    customOnOpenCreateUpdateProject();
                                    setSelectedProject(null);
                                }}
                            />
                        </Tooltip>
                    </Flex>
                    <Flex p={2} mb="250px">
                        <Table size="sm" variant="striped">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Description</Th>
                                    <Th>Edit</Th>
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
                                            <Td>
                                                <Tooltip
                                                    hasArrow
                                                    aria-label="Edit project"
                                                    label="Edit project"
                                                    colorScheme="withe"
                                                >
                                                    <IconButton
                                                        isRound={true}
                                                        aria-label="Edit project"
                                                        variant="ghost"
                                                        mr={1}
                                                        icon={<AiFillEdit />}
                                                        onClick={() => {
                                                            setContext(
                                                                "update"
                                                            );
                                                            customOnOpenCreateUpdateProject();
                                                            setSelectedProject({
                                                                project,
                                                            });
                                                        }}
                                                    />
                                                </Tooltip>
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
                <ModalCreateUpdateProject
                    context={context}
                    project={selectedProject}
                    isOpen={modalCreateUpdateProject.isOpen}
                    countUpdate={countUpdate}
                    updateCallback={updatedCallback}
                    onClose={modalCreateUpdateProject.onClose}
                />
            </Container>
        </>
    );
    return fetching ? loading : content;
};

export default Project;
