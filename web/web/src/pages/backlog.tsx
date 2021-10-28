import React, {
    useContext,
    useState,
    useEffect,
    CMouseEventHandler,
    ChangeEvent,
} from "react";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    SearchIcon,
    CloseIcon,
    ArrowUpIcon,
    ArrowDownIcon,
} from "@chakra-ui/icons";
import SideBar from "../components/layout/SideBar";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import Footer from "./../components/rootComponents/Footer";
import Login from "./../pages/login";
import FlexSpinner from "./../components/rootComponents/FlexSpinner";
import {
    Box,
    Flex,
    Text,
    IconButton,
    Link,
    Input,
    InputGroup,
    InputLeftElement,
    Button,
    Divider,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useGetItensBacklogQuery } from "./../generated/graphql";
import {
    returnPriorityIconHeaderModal,
    getItemTypeIcon,
    returnItemStatusStyled,
    itemBacklog,
    itensBacklog,
} from "./../helpers/items/ItemFunctinHelpers";
import { truncateString } from "./../helpers/generalUtilitiesFunctions";
import { useUser } from "./../helpers/hooks/useUser";
import { GlobalContext } from "./../context/globalContext";

interface backlogProps {}

const styleItemDetail = {
    display: "flex",
    justifyContent: "space-between",
    flexShrink: 0,
};

const priorityOrder = {
    HIGHEST: 5,
    HIGH: 4,
    MEDIUM: 3,
    LOW: 2,
    LOWEST: 1,
};

const statusOrder = {
    OPEN: 1,
    IN_PRORESS: 2,
    REOPENED: 3,
    RESOLVED: 4,
    COMPLETED: 5,
    CLOSED: 6,
};

const itensPerPage = 10;

const Backlog: React.FC<backlogProps> = ({}) => {
    const user = useUser();

    const { expanded } = useContext(GlobalContext);

    const [page, setPage] = useState<number>(0);
    const [pageWidth, setPageWidth] = useState("3em");
    const [searchInput, setSearchInput] = useState("");
    const [navBarWidth, setNavBarWidth] = useState("50px");
    const [itens, setItens] = useState<itensBacklog>(null);
    const [cursor, setCursor] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [itemDetailWidth, setItemDetailWidth] = useState(0);
    const [showPagination, setShowPagination] = useState(true);
    const [itemDetailOpen, setItemDetailOpen] = useState(false);
    const [decrescentStatus, setDecrescentStatus] = useState(true);
    const [decrescentCreated, setDecrescentCreated] = useState(true);
    const [decrescentUpdated, setDecrescentUpdated] = useState(true);
    const [decrescentPriority, setDecrescentPriority] = useState(true);
    const [itemDetailed, setItemDetailed] = useState<itemBacklog | null>(null);

    const closeItemDetail = (): void => {
        setItemDetailOpen(false);
        setItemDetailWidth(0);
    };

    const [itensBacklog, reexecuteQuery] = useGetItensBacklogQuery({
        variables: {
            limit: itensPerPage,
            cursor: cursor,
        },
    });

    const handlePagination = (e: CMouseEventHandler<HTMLButtonElement>) => {
        let lastIten = 0;
        let _cursor: Date | null = null;

        if (e.target.name == "1") {
            setCursor(null);
        } else {
            lastIten =
                itensPerPage <=
                itensBacklog.data?.getItensBacklog?.itens?.length
                    ? itensPerPage
                    : itensBacklog.data?.getItensBacklog?.itens?.length;

            if (lastIten) {
                _cursor = new Date(
                    itensBacklog.data?.getItensBacklog?.itens[
                        lastIten - 1
                    ].createdAt
                );
                setCursor(_cursor);
            }
        }
    };

    const returnPagination = (): JSX.Element[] => {
        let _pages: JSX.Element[] = [];

        if (page) {
            _pages.push(
                <IconButton
                    aria-label="Previous Itens page"
                    icon={<ArrowLeftIcon />}
                />
            );

            for (let i = 0; i < page; i++) {
                _pages.push(
                    <Button
                        variant={currentPage === i ? "cyan-gradient" : "ghost"}
                        name={`${i + 1}`}
                        onClick={(e) => {
                            setCurrentPage(i);
                            handlePagination(e);
                        }}
                    >
                        {i + 1}
                    </Button>
                );
            }

            _pages.push(
                <IconButton
                    aria-label="Next Itens page"
                    icon={<ArrowRightIcon />}
                />
            );
        }
        return _pages;
    };

    useEffect(() => {
        if (itensBacklog.fetching) return;

        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3em");
            setNavBarWidth("50px");
        }

        if (itensBacklog.data?.getItensBacklog) {
            if (searchInput.length < 2) {
                setItens(itensBacklog.data?.getItensBacklog);
                setPage(
                    Math.ceil(
                        itensBacklog.data?.getItensBacklog?.total / itensPerPage
                    )
                );
            }
        }
        if (cursor) {
            reexecuteQuery({ requestPolicy: "cache-and-network" });
        }
    }, [
        expanded,
        itensBacklog.fetching,
        itens?.itens?.length,
        itemDetailed,
        itemDetailOpen,
        cursor,
        currentPage,
    ]);

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
                <Flex flexDir="row" alignItems="center" p={2} ml={2}>
                    <NextLink href={"/"}>
                        <Link>
                            <Text>Home</Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>
                    <NextLink href={"/backlog"}>
                        <Link>
                            <Text>Backlog</Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>
                </Flex>
                <Text p={2} fontSize="lg" fontWeight="semibold" ml={2}>
                    Backlog
                </Text>
                <InputGroup ml={2}>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<SearchIcon color="gray.300" />}
                    />
                    <Input
                        onFocus={closeItemDetail}
                        maxW="300px"
                        placeholder="Filter info (On this page)"
                        borderRadius="2em"
                        value={searchInput}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setSearchInput(e.target.value);
                            if (e.target.value.length >= 2) {
                                setShowPagination(false);

                                let regexTerm =
                                    "[ˆ,]*" + e.target.value + "[,$]*";
                                let result = itens.itens.filter((item) =>
                                    item.summary.match(regexTerm)
                                );
                                setItens({
                                    itens: result,
                                });
                            } else {
                                setItens(itensBacklog.data?.getItensBacklog);
                                setPage(
                                    Math.ceil(
                                        itensBacklog.data?.getItensBacklog
                                            ?.total / itensPerPage
                                    )
                                );
                                setShowPagination(true);
                            }
                        }}
                    />
                    <Button variant="cyan-gradient" borderRadius="2em" ml={3}>
                        My Itens
                    </Button>
                </InputGroup>
                <Flex
                    flexGrow={1}
                    p={2}
                    mt={2}
                    mb={1}
                    ml={2}
                    alignItems="center"
                >
                    <Text>Order by:</Text>
                    <Button
                        variant="ghost"
                        name="created"
                        ml={2}
                        rightIcon={
                            decrescentCreated ? (
                                <ArrowUpIcon />
                            ) : (
                                <ArrowDownIcon />
                            )
                        }
                        onClick={() => {
                            setItemDetailOpen(false);
                            setItemDetailWidth(0);
                            setDecrescentCreated(!decrescentCreated);

                            if (decrescentCreated) {
                                itens.itens.sort(
                                    (a: itemBacklog, b: itemBacklog) =>
                                        b.createdAt > a.createdAt ? 1 : -1
                                );
                            } else {
                                itens.itens.sort(
                                    (a: itemBacklog, b: itemBacklog) =>
                                        b.createdAt < a.createdAt ? 1 : -1
                                );
                            }
                        }}
                    >
                        Created At
                    </Button>
                    <Button
                        variant="ghost"
                        name="updated"
                        ml={2}
                        rightIcon={
                            decrescentUpdated ? (
                                <ArrowUpIcon />
                            ) : (
                                <ArrowDownIcon />
                            )
                        }
                        onClick={() => {
                            setItemDetailOpen(false);
                            setItemDetailWidth(0);
                            setDecrescentUpdated(!decrescentUpdated);
                            if (decrescentUpdated) {
                                itens.itens.sort(
                                    (a: itemBacklog, b: itemBacklog) =>
                                        b.updatedAt > a.updatedAt ? 1 : -1
                                );
                            } else {
                                itens.itens.sort(
                                    (a: itemBacklog, b: itemBacklog) =>
                                        b.updatedAt < a.updatedAt ? 1 : -1
                                );
                            }
                        }}
                    >
                        Updated At
                    </Button>
                    <Button
                        variant="ghost"
                        name="priority"
                        ml={2}
                        rightIcon={
                            decrescentPriority ? (
                                <ArrowUpIcon />
                            ) : (
                                <ArrowDownIcon />
                            )
                        }
                        onClick={() => {
                            setItemDetailOpen(false);
                            setItemDetailWidth(0);
                            setDecrescentPriority(!decrescentPriority);

                            if (decrescentPriority) {
                                itens.itens.sort(
                                    (a: itemBacklog, b: itemBacklog) =>
                                        priorityOrder[b.priority] >
                                        priorityOrder[a.priority]
                                            ? 1
                                            : -1
                                );
                            } else {
                                itens.itens.sort(
                                    (a: itemBacklog, b: itemBacklog) =>
                                        priorityOrder[b.priority] <
                                        priorityOrder[a.priority]
                                            ? 1
                                            : -1
                                );
                            }
                        }}
                    >
                        Priority
                    </Button>
                    <Button
                        variant="ghost"
                        name="status"
                        ml={2}
                        rightIcon={
                            decrescentStatus ? (
                                <ArrowUpIcon />
                            ) : (
                                <ArrowDownIcon />
                            )
                        }
                        onClick={() => {
                            setItemDetailOpen(false);
                            setItemDetailWidth(0);
                            setDecrescentStatus(!decrescentStatus);
                            if (decrescentStatus) {
                                itens.itens.sort(
                                    (a: itemBacklog, b: itemBacklog) =>
                                        statusOrder[b.status] >
                                        statusOrder[a.status]
                                            ? 1
                                            : -1
                                );
                            } else {
                                itens.itens.sort(
                                    (a: itemBacklog, b: itemBacklog) =>
                                        statusOrder[b.status] <
                                        statusOrder[a.status]
                                            ? 1
                                            : -1
                                );
                            }
                        }}
                    >
                        Status
                    </Button>
                </Flex>
                {itensBacklog.fetching && !itens?.itens ? (
                    <FlexSpinner />
                ) : (
                    <Flex flexDir="row">
                        <Flex
                            flexDir="column"
                            p={2}
                            cursor="pointer"
                            flexGrow={1}
                        >
                            {itens &&
                                itens.itens.map((item) => (
                                    <Flex
                                        key={item.id}
                                        justifyContent="space-between"
                                        alignItems="center"
                                        boxShadow="md"
                                        p={1}
                                        m={1}
                                        onClick={() => {
                                            setItemDetailOpen(true);
                                            setItemDetailWidth(0.5);
                                            setItemDetailed(item);
                                        }}
                                    >
                                        <Flex>
                                            {getItemTypeIcon(item.type)}
                                            <Text>
                                                {truncateString(
                                                    item.summary,
                                                    30
                                                )}
                                            </Text>
                                            <Text fontWeight="semibold" ml={3}>
                                                {item.sprint.code}
                                            </Text>
                                        </Flex>
                                        {returnPriorityIconHeaderModal(
                                            item.priority
                                        )}
                                    </Flex>
                                ))}
                        </Flex>
                        <Flex
                            // display={itemDetailOpen ? "flex" : "none"}
                            flexGrow={itemDetailWidth}
                            overflowY="hidden"
                            overflowX="hidden"
                            transition="0.3s"
                            boxShadow="md"
                            mr={2}
                        >
                            {itemDetailed && itemDetailOpen ? (
                                <Flex flexDir="column" flexGrow={1} p={2}>
                                    <div style={styleItemDetail}>
                                        <Flex>
                                            {getItemTypeIcon(itemDetailed.type)}
                                            <Text>
                                                {truncateString(
                                                    itemDetailed.summary,
                                                    30
                                                )}
                                            </Text>
                                        </Flex>

                                        <IconButton
                                            isRound={true}
                                            aria-label="Close Item Detail"
                                            icon={<CloseIcon />}
                                            onClick={closeItemDetail}
                                        />
                                    </div>
                                    <Flex>
                                        <Text mr={2}>Current Status:</Text>
                                        {returnItemStatusStyled(
                                            itemDetailed.status
                                        )}
                                    </Flex>
                                    <Flex p={2} boxShadow="md">
                                        <Flex flexDir="column" flexGrow={1}>
                                            <Flex
                                                flexGrow={1}
                                                justifyContent="center"
                                            >
                                                <Text>Information</Text>
                                            </Flex>
                                            <Divider orientation="horizontal" />

                                            <Flex mt={2}>
                                                <Text mr={2}>Responsible:</Text>
                                                {itemDetailed.responsible.name}
                                            </Flex>
                                            <Flex mt={2}>
                                                <Text mr={2}>Reporter:</Text>
                                                {itemDetailed.reporter.name}
                                            </Flex>
                                            <Flex
                                                mt={2}
                                                justifyContent="space-between"
                                            >
                                                <Flex>
                                                    <Text mr={2}>Sprint:</Text>
                                                    {itemDetailed.sprint.code}
                                                </Flex>
                                                <Flex>
                                                    <Text mr={2}>
                                                        Sprint End:
                                                    </Text>
                                                    {new Date(
                                                        itemDetailed.sprint.final
                                                    ).toDateString()}
                                                </Flex>
                                            </Flex>
                                            <Flex mt={2}>
                                                <Text mr={2}>Project:</Text>
                                                {
                                                    itemDetailed.sprint.project
                                                        .name
                                                }
                                            </Flex>
                                            <Flex mt={2}>
                                                <Text mr={2}>Priority:</Text>
                                                {returnPriorityIconHeaderModal(
                                                    itemDetailed.priority
                                                )}
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                    <Flex p={2} mt={2}>
                                        <Text>{itemDetailed.description}</Text>
                                    </Flex>
                                </Flex>
                            ) : (
                                <></>
                            )}
                        </Flex>
                    </Flex>
                )}

                <Flex
                    justifyContent="center"
                    display={showPagination ? "flex" : "none"}
                >
                    {returnPagination().map((page, index) => (
                        <Box m={1} key={index}>
                            {page}
                        </Box>
                    ))}
                </Flex>
            </Flex>
            <Box id="footer">
                <Footer />
            </Box>
        </Container>
    );

    return user.userId ? content : <Login />;
};

export default Backlog;
