import React, { useContext, useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
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
    Tooltip,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Index from "./index";
import { IoPersonAddOutline } from "react-icons/io5";
import { AiFillEdit } from "react-icons/ai";
import { useGetAllUsersQuery } from "./../generated/graphql";
import FlexSpinner from "./../components/rootComponents/FlexSpinner";

interface manageProps {}

const Manage: React.FC<manageProps> = ({}) => {
    const { userId, userRole } = useContext(GlobalContext);

    const [expand, setExpand] = useState(true);
    const [sideBarWidth, setSideBarWidth] = useState("0px");
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("0px");

    const [users] = useGetAllUsersQuery({
        variables: {
            limit: 10,
            active: true,
        },
    });

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
        if (users.fetching) return;

        console.log("id ", userId);
        console.log("role ", userRole);
        // console.log("localStorage", localStorage);
    }, [users.fetching]);

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
                    <NextLink href={"/manage"}>
                        <Link>
                            <Text>Manage</Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>
                </Flex>
                <Text p={2} fontSize="lg" fontWeight="semibold" ml={2}>
                    Management
                </Text>
                <Flex p={2} m={2} justifyContent="end">
                    <Tooltip
                        hasArrow
                        aria-label="Add new user"
                        label="Add a new user"
                        colorScheme="withe"
                    >
                        <IconButton
                            isRound={true}
                            aria-label="Add new user"
                            variant="cyan-gradient"
                            mr={1}
                            icon={<IoPersonAddOutline />}
                        />
                    </Tooltip>
                </Flex>

                {users.data?.getAllUsers?.users ? (
                    <Flex p={2} m={2}>
                        <Table variant="striped">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Email</Th>
                                    <Th>Role</Th>
                                    <Th>Active?</Th>
                                    <Th>Edit</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {users.data?.getAllUsers?.users?.map((user) => (
                                    <Tr key={user.id}>
                                        <Th>{user.name}</Th>
                                        <Th>{user.email}</Th>
                                        <Th>{user.role.name}</Th>
                                        <Th>{user.active ? "Yes" : "No"}</Th>
                                        <Th>
                                            <Tooltip
                                                hasArrow
                                                aria-label="Edit user"
                                                label="Edit user"
                                                colorScheme="withe"
                                            >
                                                <IconButton
                                                    isRound={true}
                                                    aria-label="Edit user"
                                                    variant="ghost"
                                                    mr={1}
                                                    icon={<AiFillEdit />}
                                                />
                                            </Tooltip>
                                        </Th>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Flex>
                ) : (
                    <FlexSpinner />
                )}
            </Flex>
            <Box id="footer">
                <Footer />
            </Box>
        </Container>
    );

    /*

    if (userId) {
        userRole === "Admin" ? content : <Index />;
    } else {
        return <Login />;
    }

    return userId ? content : <Login />; */

    return content;
};

export default Manage;
