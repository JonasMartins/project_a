import React, { useContext, useState, useEffect } from "react";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    SearchIcon,
    CloseIcon,
} from "@chakra-ui/icons";
import SideBar from "../components/layout/SideBar";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import Footer from "./../components/rootComponents/Footer";
import Login from "./../pages/login";
import { GlobalContext } from "./../context/globalContext";
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
import {
    useGetItensBacklogQuery,
    Maybe,
    Item,
    Sprint,
    Project,
} from "./../generated/graphql";
import {
    returnPriorityIconHeaderModal,
    getItemTypeIcon,
    returnItemStatusStyled,
} from "./../helpers/items/ItemFunctinHelpers";
import { truncateString } from "./../helpers/generalUtilitiesFunctions";

interface backlogProps {}

const styleItemDetail = {
    display: "flex",
    justifyContent: "space-between",
    flexShrink: 0,
};

type item = { __typename?: "Item" } & Pick<
    Item,
    | "id"
    | "summary"
    | "type"
    | "priority"
    | "status"
    | "updatedAt"
    | "description"
> & {
        responsible: { __typename?: "User" } & Pick<User, "id" | "name">;
        reporter: { __typename?: "User" } & Pick<User, "id" | "name">;
        sprint: { __typename?: "Sprint" } & Pick<
            Sprint,
            "code" | "createdAt" | "length" | "final"
        > & {
                project: { __typename?: "Project" } & Pick<Project, "name">;
            };
    };

type itens = {
    itens?: Maybe<
        Array<
            { __typename?: "Item" } & Pick<
                Item,
                | "id"
                | "summary"
                | "type"
                | "priority"
                | "status"
                | "updatedAt"
                | "description"
            > & {
                    responsible: { __typename?: "User" } & Pick<
                        User,
                        "id" | "name"
                    >;
                    reporter: { __typename?: "User" } & Pick<
                        User,
                        "id" | "name"
                    >;
                    sprint: { __typename?: "Sprint" } & Pick<
                        Sprint,
                        "code" | "createdAt" | "length" | "final"
                    > & {
                            project: { __typename?: "Project" } & Pick<
                                Project,
                                "name"
                            >;
                        };
                }
        >
    >;
};

const Backlog: React.FC<backlogProps> = ({}) => {
    const { userId } = useContext(GlobalContext);

    const [expand, setExpand] = useState(true);
    const [sideBarWidth, setSideBarWidth] = useState("0px");
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("0px");
    const [page, setPage] = useState<number | null>(null);
    const [cursor, setCursor] = useState<Date | null>(null);
    const [itens, setItens] = useState<itens>(null);
    const [itemDetailWidth, setItemDetailWidth] = useState(0);
    const [itemDetailOpen, setItemDetailOpen] = useState(false);
    const [itemDetailed, setItemDetailed] = useState<item | null>(null);

    const closeItemDetail = (): void => {
        setItemDetailOpen(false);
        setItemDetailWidth(0);
    };

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

    const [itensBacklog] = useGetItensBacklogQuery({
        variables: {
            limit: page ? page : 10,
            cursor: cursor,
        },
    });

    useEffect(() => {
        if (itensBacklog.fetching) return;

        if (itensBacklog.data?.getItensBacklog) {
            setItens(itensBacklog.data?.getItensBacklog);
        }
        // console.log("itens ", itens);
    }, [
        itensBacklog.fetching,
        itens?.itens?.length,
        itemDetailed,
        itemDetailOpen,
    ]);

    const content = (
        <Container>
            <Navbar pageWidth={navBarWidth} />
            <SideBar
                width={sideBarWidth}
                visibility={expand ? "hidden" : "visible"}
            />
            <Flex
                alignSelf="normal"
                flexDir="column"
                flexGrow={1}
                mb="150px"
                ml={pageWidth}
                transition="0.3s"
            >
                <Flex flexDir="row" alignItems="center" p={2}>
                    <Flex mt={2}>
                        <IconButton
                            isRound={true}
                            aria-label="Show Side Bar"
                            mr={1}
                            icon={
                                expand ? <ArrowLeftIcon /> : <ArrowRightIcon />
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
                    <NextLink href={"/backlog"}>
                        <Link>
                            <Text>Backlog</Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>
                </Flex>
                <Text p={2} fontSize="lg" fontWeight="semibold">
                    Backlog
                </Text>
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<SearchIcon color="gray.300" />}
                    />
                    <Input
                        onFocus={closeItemDetail}
                        type="text"
                        maxW="300px"
                        placeholder="Filter info"
                        borderRadius="2em"
                    />
                    <Button variant="cyan-gradient" borderRadius="2em" ml={3}>
                        My Itens
                    </Button>
                </InputGroup>
                <Flex flexDir="row">
                    <Flex flexDir="column" p={2} cursor="pointer" flexGrow={1}>
                        {itens &&
                            itens.itens.map((item) => (
                                <Flex
                                    key={item.id}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    p={1}
                                    boxShadow="md"
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
                                            {truncateString(item.summary, 30)}
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
                                                <Text mr={2}>Sprint End:</Text>
                                                {new Date(
                                                    itemDetailed.sprint.final
                                                ).toDateString()}
                                            </Flex>
                                        </Flex>
                                        <Flex mt={2}>
                                            <Text mr={2}>Project:</Text>
                                            {itemDetailed.sprint.project.name}
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
            </Flex>
            <Box id="footer">
                <Footer />
            </Box>
        </Container>
    );

    return userId ? content : <Login />;
};

export default Backlog;
