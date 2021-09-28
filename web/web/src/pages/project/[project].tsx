import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    IconButton,
    Link,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { Container } from "./../../components/Container";
import ItemSprintBox from "./../../components/layout/ItemSprintBox";
import SideBar from "./../../components/layout/SideBar";
import Footer from "./../../components/rootComponents/Footer";
import FullPageSpinner from "./../../components/rootComponents/FullPageSpinner";
import Navbar from "./../../components/rootComponents/Navbar";
import {
    Item,
    ItemStatus,
    useGetProjectByIdQuery,
} from "./../../generated/graphql";

interface projectsProps {}

type itemQuery = {
    __typename?: "Item";
} & Pick<
    Item,
    "id" | "description" | "summary" | "status" | "priority" | "type"
>;

const Project: React.FC<projectsProps> = ({}) => {
    const router = useRouter();

    let previousItemStatus: string = "";

    const [dragedItem, setDragedItem] = useState<itemQuery | null>(null);
    const [expand, setExpand] = useState(true);
    const [sideBarWidth, setSideBarWidth] = useState("0px");
    const [pageWidth, setPageWidth] = useState("3em");

    const [pendingItens, setPendingItens] = useState<Array<itemQuery>>([]);
    const [progressItens, setProgressItens] = useState<Array<itemQuery>>([]);
    const [doneItens, setDoneItens] = useState<Array<itemQuery>>([]);

    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.800" };
    const color = { light: "black", dark: "white" };

    const { project } = router.query;
    const [{ data, fetching, error }, reexecuteQuery] = useGetProjectByIdQuery({
        variables: {
            id: typeof project === "string" ? project : "",
        },
        pause: true,
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

    useEffect(() => {
        if (fetching) return;
        loadItensByTypes();
        reexecuteQuery({ requestPolicy: "cache-first" });
    }, [fetching, reexecuteQuery]);

    useEffect(() => {
        return () => {
            setDoneItens([]);
            setPendingItens([]);
            setProgressItens([]);
        };
    }, []);

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

    const loadItensByTypes = (): void => {
        if (!(data && data.getProjectById?.project?.sprints[0]?.itens)) {
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
                margin="1em 2em 1em"
                flexDir="row"
                alignItems="center"
                ml={pageWidth}
                transition="0.3s"
            >
                <IconButton
                    isRound={true}
                    aria-label="Show Side Bar"
                    mr={1}
                    icon={expand ? <ArrowLeftIcon /> : <ArrowRightIcon />}
                    onClick={handleExpandSideBar}
                />
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
                        <Text>{data && data.getProjectById.project.name}</Text>
                    </Link>
                </NextLink>
                <Text color="gray.500" ml={2} mr={2}>
                    {">"}
                </Text>
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
                    {pendingItens.length &&
                        pendingItens.map((item) => (
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
                    {progressItens.length &&
                        progressItens.map((item) => (
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
                    {doneItens.length &&
                        doneItens.map((item) => (
                            <ItemSprintBox
                                draggable
                                key={item.id}
                                item={item}
                            />
                        ))}
                </Flex>
            </Flex>
            <Box id="footer">
                <Footer />
            </Box>
        </Container>
    );

    return fetching ? loading : content;
};

export default Project;
