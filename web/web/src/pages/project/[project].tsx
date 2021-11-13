import { Box, Flex, Link, Text, useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { Container } from "../../components/Container";
import ItemSprintBox from "../../components/layout/ItemSprintBox";
import SideBar from "../../components/layout/SideBar";
import Footer from "../../components/rootComponents/Footer";
import FullPageSpinner from "../../components/rootComponents/FullPageSpinner";
import Navbar from "../../components/rootComponents/Navbar";
import {
    Item,
    ItemStatus,
    useGetProjectByIdQuery,
} from "../../generated/graphql";
import { GlobalContext } from "./../../context/globalContext";

interface projectsProps {
    id: string;
}

type itemQuery = {
    __typename?: "Item";
} & Pick<
    Item,
    "id" | "description" | "summary" | "status" | "priority" | "type"
>;

const Project: React.FC<projectsProps> = ({}) => {
    const router = useRouter();

    let previousItemStatus: string = "";

    const { colorMode } = useColorMode();
    const { expanded } = useContext(GlobalContext);
    const [dataLoaded, setDataLoaded] = useState(1);
    const [fillItens, setFillItens] = useState(false);
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("50px");
    const [doneItens, setDoneItens] = useState<Array<itemQuery>>([]);
    const [dragedItem, setDragedItem] = useState<itemQuery | null>(null);
    const [pendingItens, setPendingItens] = useState<Array<itemQuery>>([]);
    const [progressItens, setProgressItens] = useState<Array<itemQuery>>([]);

    const bgColor = { light: "gray.200", dark: "gray.800" };
    const color = { light: "black", dark: "white" };

    const { project } = router.query;

    let url = "";

    if (project && project !== undefined) {
        url = typeof project === "string" ? project : project[0];
    }

    const [{ data, fetching, error }, reexecuteQuery] = useGetProjectByIdQuery({
        variables: {
            // id: project && typeof project === "string" ? project : "-1",
            id: url,
        },
        pause: !project,
    });

    const [{ canDropPending }, dropRefPending] = useDrop({
        accept: "item",
        canDrop: (item: itemQuery) => {
            return !!!pendingItens.find((element) => element.id === item.id);
        },

        drop: (item: itemQuery) => {
            previousItemStatus = item.status;

            if (item.status === ItemStatus.InProgress) {
                item.status = ItemStatus.Open;
            } else {
                item.status = ItemStatus.Reopened;
            }

            setPendingItens((prevItens) => [...prevItens, item]);

            removeItemFromStatusArray(item);

            setDragedItem(item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDropPending: monitor.canDrop(),
        }),
    });

    const [{ candropProgress }, dropRefProgress] = useDrop({
        accept: "item",

        canDrop: (item: itemQuery) => {
            return !!!progressItens.find((element) => element.id === item.id);
        },

        drop: (item: itemQuery) => {
            previousItemStatus = item.status;

            item.status = ItemStatus.InProgress;

            setProgressItens((prevItens) => [...prevItens, item]);
            removeItemFromStatusArray(item);
            setDragedItem(item);
        },

        hover: (_, monitor) => {
            monitor.isOver({ shallow: true });
        },

        collect: (monitor) => ({
            isOver: monitor.isOver(),
            candropProgress: monitor.canDrop(),
        }),
    });

    const [{ canDropDone }, dropRefDone] = useDrop({
        accept: "item",

        canDrop: (item: itemQuery) => {
            return (
                !!!doneItens.find((element) => element.id === item.id) &&
                item.status !== ItemStatus.Open &&
                item.status !== ItemStatus.Reopened
            );
        },

        drop: (item: itemQuery) => {
            previousItemStatus = item.status;

            item.status = ItemStatus.Resolved;

            setDoneItens((prevItens) => [...prevItens, item]);
            removeItemFromStatusArray(item);
            setDragedItem(item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDropDone: monitor.canDrop(),
        }),
    });

    const removeItemFromStatusArray = (item: itemQuery): void => {
        switch (previousItemStatus) {
            case ItemStatus.Open:
                if (pendingItens.length) {
                    setPendingItens(
                        pendingItens.filter((_item) => item.id !== _item.id)
                    );
                }
                break;
            case ItemStatus.Reopened:
                if (pendingItens.length) {
                    setPendingItens(
                        pendingItens.filter((_item) => item.id !== _item.id)
                    );
                }
                break;
            case ItemStatus.InProgress:
                if (progressItens.length) {
                    setProgressItens(
                        progressItens.filter((_item) => item.id !== _item.id)
                    );
                }
                break;
            case ItemStatus.Completed:
                if (doneItens.length) {
                    setDoneItens(
                        doneItens.filter((_item) => item.id !== _item.id)
                    );
                }
                break;
            case ItemStatus.Resolved:
                if (doneItens.length) {
                    setDoneItens(
                        doneItens.filter((_item) => item.id !== _item.id)
                    );
                }
                break;
            default:
                return;
        }
    };

    const loadItensByTypes = (): void => {
        if (error) {
            return;
        }
        if (!data) {
            setDataLoaded(dataLoaded + 1);
            return;
        }

        if (!data.getProjectById?.project?.sprints.length) {
            return;
        }

        data.getProjectById?.project?.sprints[0]?.itens?.map((item) => {
            switch (item.status) {
                case ItemStatus.Open:
                    setPendingItens((prevItens) => [...prevItens, item]);
                    break;
                case ItemStatus.Reopened:
                    setPendingItens((prevItens) => [...prevItens, item]);
                    break;
                case ItemStatus.InProgress:
                    setProgressItens((prevItens) => [...prevItens, item]);
                    break;
                case ItemStatus.Completed:
                    setDoneItens((prevItens) => [...prevItens, item]);
                    break;
                case ItemStatus.Resolved:
                    setDoneItens((prevItens) => [...prevItens, item]);
                    break;
            }
        });
        setFillItens(true);
    };

    useEffect(() => {
        if (fetching) return;

        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3.5em");
            setNavBarWidth("50px");
        }

        if (!fillItens) {
            loadItensByTypes();
        }

        reexecuteQuery({ requestPolicy: "cache-and-network" });
        // [fetching, reexecuteQuery, dataLoaded, expanded]
    }, [project, fetching, dataLoaded, expanded, reexecuteQuery]);

    useEffect(() => {
        return () => {
            setDoneItens([]);
            setPendingItens([]);
            setProgressItens([]);
            setFillItens(false);
        };
    }, []);

    if (error) {
        return <p>Oh no... {error.message}</p>;
    }

    const loading = <FullPageSpinner />;

    const content = (
        <Container>
            <Navbar pageWidth={navBarWidth} />
            <SideBar />
            <Flex
                p={1}
                // margin="1em 2em 1em"
                flexDir="row"
                alignItems="center"
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

                    <NextLink href={"/project"}>
                        <Link>
                            <Text>Project</Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>

                    <NextLink href={`/project/${project}`}>
                        <Link>
                            <Text>
                                {data && data.getProjectById.project.name}
                            </Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>
                </Flex>
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
            {data?.getProjectById?.project?.sprints?.length ? (
                <Flex
                    flexDir="row"
                    ml={pageWidth}
                    overflowX="hidden"
                    transition="0.3s"
                >
                    <Flex
                        border={canDropPending ? "1px dashed" : "none"}
                        minH="150px"
                        flexGrow={1}
                        boxShadow="lg"
                        flexDir="column"
                        p={3}
                        m="2em 2em 20em 0"
                        bg={bgColor[colorMode]}
                        color={color[colorMode]}
                        ref={dropRefPending}
                    >
                        <Text size="lg">PEDNDING</Text>
                        {pendingItens.map((item) => (
                            <ItemSprintBox
                                draggable
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </Flex>

                    <Flex
                        border={candropProgress ? "1px dashed" : "none"}
                        minH="150px"
                        flexGrow={1}
                        boxShadow="lg"
                        flexDir="column"
                        p={3}
                        m="2em 2em 20em 0"
                        bg={bgColor[colorMode]}
                        color={color[colorMode]}
                        ref={dropRefProgress}
                    >
                        <Text size="lg">IN PROGRESS</Text>
                        {progressItens.map((item) => (
                            <ItemSprintBox
                                draggable
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </Flex>
                    <Flex
                        border={canDropDone ? "1px dashed" : "none"}
                        minH="150px"
                        flexGrow={1}
                        boxShadow="lg"
                        flexDir="column"
                        p={3}
                        m="2em 2em 20em 0"
                        bg={bgColor[colorMode]}
                        color={color[colorMode]}
                        ref={dropRefDone}
                    >
                        <Text size="lg">DONE</Text>
                        {doneItens.map((item) => (
                            <ItemSprintBox
                                draggable
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </Flex>
                </Flex>
            ) : (
                <Flex alignSelf="center" mb={"150px"}>
                    <Text fontSize="2xl">
                        {`The "${data?.getProjectById?.project?.name}" project doesn't have an active sprint, please manege
                        one at Backlog`}
                    </Text>
                </Flex>
            )}
            <Box id="footer">
                <Footer />
            </Box>
        </Container>
    );
    return fetching || !project ? loading : content;
};

export default Project;
