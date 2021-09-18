import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container } from "./../../components/Container";
import {
    Box,
    Flex,
    Text,
    IconButton,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from "@chakra-ui/react";
import FullPageSpinner from "./../../components/rootComponents/FullPageSpinner";
import Navbar from "./../../components/rootComponents/Navbar";
import Footer from "./../../components/rootComponents/Footer";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useGetProjectByIdQuery } from "./../../generated/graphql";
import SideBar from "./../../components/layout/SideBar";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import StatusItemDraggable from "./../../components/layout/StatusItemDraggable";
import ItemSprintBox from "./../../components/layout/ItemSprintBox";

interface projectsProps {}

const Project: React.FC<projectsProps> = ({}) => {
    const router = useRouter();

    const [expand, setExpand] = useState(true);
    const [sideBarWidth, setSideBarWidth] = useState("0px");
    const [pageWidth, setPageWidth] = useState("3em");

    const { project } = router.query;
    const [{ data, fetching, error }, reexecuteQuery] = useGetProjectByIdQuery({
        variables: {
            id: typeof project === "string" ? project : "",
        },
        pause: true,
    });

    useEffect(() => {
        if (fetching) return;
        reexecuteQuery({ requestPolicy: "cache-and-network" });
    }, [fetching, reexecuteQuery]);

    // if (data && data.getProjectById.errors)
    //     return  ( data.getProjectById.errors.map((erro) => <p>{erro.message}</p>) );

    const handleExpandSideBar = (): void => {
        setExpand(!expand);

        if (expand) {
            setSideBarWidth("215px");
            setPageWidth("20em");
        } else {
            setSideBarWidth("0px");
            setPageWidth("3em");
        }
    };

    if (error) return <p>Oh no... {error.message}</p>;

    const loading = <FullPageSpinner />;

    const content = (
        <Container>
            <Navbar />
            <SideBar
                projectName={data && data.getProjectById.project.name}
                width={sideBarWidth}
                visibility={expand ? "hidden" : "visible"}
            />
            <Flex
                p={2}
                mt="1em"
                mb="1em"
                ml={pageWidth}
                overflowX="hidden"
                transition="0.3s"
            >
                <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
                    <BreadcrumbItem>
                        <IconButton
                            isRound={true}
                            aria-label="Switch Theme"
                            icon={
                                expand ? <ArrowLeftIcon /> : <ArrowRightIcon />
                            }
                            onClick={handleExpandSideBar}
                        />
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/project">
                            Projects
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/project/${project}`}>
                            {data && data.getProjectById.project.name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Flex>
            <Flex
                mt="1em"
                mb="1em"
                ml={pageWidth}
                overflowX="hidden"
                transition="0.3s"
            >
                <Text fontSize="3xl">
                    {data && data.getProjectById.project.name}
                </Text>
            </Flex>
            <Flex
                flexDir="row"
                ml={pageWidth}
                overflowX="hidden"
                transition="0.3s"
            >
                <StatusItemDraggable>
                    <Text size="lg">PEDNDING</Text>
                    {data &&
                        data.getProjectById.project.sprints[0].itens.map(
                            (iten) => (
                                <ItemSprintBox
                                    key={iten.id}
                                    summary={iten.summary}
                                />
                            )
                        )}
                </StatusItemDraggable>
                <StatusItemDraggable>
                    <Text size="lg">IN PROGRESS</Text>
                </StatusItemDraggable>
                <StatusItemDraggable>
                    <Text size="lg">DONE</Text>
                </StatusItemDraggable>
            </Flex>
            <Box id="footer">
                <Footer />
            </Box>
        </Container>
    );

    return fetching ? loading : content;
};

export default Project;
