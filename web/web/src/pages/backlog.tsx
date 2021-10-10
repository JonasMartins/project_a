import React, { useContext, useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useGetItensBacklogQuery, Maybe, Item } from "./../generated/graphql";
import {
    returnPriorityIconHeaderModal,
    getItemTypeIcon,
} from "./../helpers/items/ItemFunctinHelpers";

interface backlogProps {}

type itens = {
    itens?: Maybe<
        Array<
            { __typename?: "Item" } & Pick<
                Item,
                "id" | "summary" | "type" | "priority" | "status" | "updatedAt"
            > & {
                    responsible: { __typename?: "User" } & Pick<
                        User,
                        "id" | "name"
                    >;
                    reporter: { __typename?: "User" } & Pick<
                        User,
                        "id" | "name"
                    >;
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
        console.log("itens ", itens);
    }, [itensBacklog.fetching, itens?.itens?.length]);

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
                        type="text"
                        maxW="300px"
                        placeholder="Filter info"
                        borderRadius="2em"
                    />
                    <Button variant="cyan-gradient" borderRadius="2em" ml={3}>
                        My Itens
                    </Button>
                </InputGroup>
                <Flex flexDir="column" flexGrow={1} p={2}>
                    {itens &&
                        itens.itens.map((item) => (
                            <Flex
                                key={item.id}
                                justifyContent="space-between"
                                alignItems="center"
                                p={1}
                                // border="1px solid grey"
                                boxShadow="md"
                                m={1}
                            >
                                <Flex>
                                    {getItemTypeIcon(item.type)}
                                    <Text>{item.summary}</Text>
                                </Flex>
                                {returnPriorityIconHeaderModal(item.priority)}
                            </Flex>
                        ))}
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
