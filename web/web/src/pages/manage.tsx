import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    IconButton,
    Link,
    Table,
    Tbody,
    Text,
    Th,
    Td,
    Thead,
    Tooltip,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { IoPersonAddOutline } from "react-icons/io5";
import SideBar from "../components/layout/SideBar";
import { Container } from "./../components/Container";
import FlexSpinner from "./../components/rootComponents/FlexSpinner";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import Footer from "./../components/rootComponents/Footer";
import Navbar from "./../components/rootComponents/Navbar";
import {
    useGetAllUsersQuery,
    GetAllRolesQuery,
    useGetAllRolesQuery,
} from "./../generated/graphql";
import { useUser } from "./../helpers/hooks/useUser";
import ModalManagerUpdateUser from "./../components/modal/ModalManagerUpdateUser";
import { userManageInfo } from "./../helpers/users/userFunctonHelpers";

interface manageProps {}

const Manage: React.FC<manageProps> = ({}) => {
    const user = useUser();
    const [expand, setExpand] = useState(true);
    const [sideBarWidth, setSideBarWidth] = useState("0px");
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("0px");
    const [seletedUser, setSelectedUser] = useState<userManageInfo | null>(
        null
    );
    const [roles, setRoles] = useState<GetAllRolesQuery | null>(null);

    const [users] = useGetAllUsersQuery({
        variables: {
            limit: 10,
            active: true,
        },
    });

    const [allRoles] = useGetAllRolesQuery();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const customOnOpen = (): void => {
        onOpen();
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

    useEffect(() => {
        if (users.fetching && allRoles.fetching) return;

        if (allRoles.data) {
            setRoles(allRoles.data);
        }
    }, [users.fetching, allRoles.fetching]);

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
                        <Table variant="striped" size="sm">
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
                                        <Td>{user.name}</Td>
                                        <Td>{user.email}</Td>
                                        <Td>{user.role.name}</Td>
                                        <Td>{user.active ? "Yes" : "No"}</Td>
                                        <Td>
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
                                                    onClick={() => {
                                                        customOnOpen();
                                                        setSelectedUser({
                                                            user,
                                                        });
                                                    }}
                                                />
                                            </Tooltip>
                                        </Td>
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
            <ModalManagerUpdateUser
                user={seletedUser}
                isOpen={isOpen}
                roles={roles}
                onClose={onClose}
            />
        </Container>
    );

    // if (user.userId) {
    //     user.role === "Admin" ? content : <Index />;
    // } else {
    //     return <Login />;
    // }

    // return user && user.userId ? content : <Login />;

    return users.fetching ? <FullPageSpinner /> : content;
};

export default Manage;
