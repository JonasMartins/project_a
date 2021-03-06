import {
    Box,
    Flex,
    IconButton,
    Link,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Image,
    Button,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { IoPersonAddOutline } from "react-icons/io5";
import SideBar from "../components/layout/SideBar";
import { Container } from "./../components/Container";
import ModalManagerUpdateCreate from "../components/modal/ModalManagerUpdateCreateUser";
import FlexSpinner from "./../components/rootComponents/FlexSpinner";
import Footer from "./../components/rootComponents/Footer";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import Navbar from "./../components/rootComponents/Navbar";
import { GlobalContext } from "./../context/globalContext";
import {
    GetAllRolesQuery,
    useGetAllRolesQuery,
    useGetAllUsersQuery,
} from "./../generated/graphql";
import { useUser } from "./../helpers/hooks/useUser";
import { userManageInfo } from "./../helpers/users/userFunctonHelpers";
import { getServerPathImage } from "./../utils/handleServerImagePaths";

interface manageProps {}
type manageContext = "update" | "create";

const Manage: React.FC<manageProps> = ({}) => {
    const user = useUser();

    const { expanded } = useContext(GlobalContext);
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("50px");
    const [seletedUser, setSelectedUser] = useState<userManageInfo | null>(
        null
    );
    const [activeUsers, setActiveUsers] = useState(true);
    const [countUpdate, setCountUpdate] = useState(0);
    const [context, setContext] = useState<manageContext>("update");

    const [roles, setRoles] = useState<GetAllRolesQuery | null>(null);

    const updatedCallback = (value: number): void => {
        setCountUpdate(value);
    };

    const [users, reexecuteQuery] = useGetAllUsersQuery({
        variables: {
            limit: 10,
            active: activeUsers,
        },
    });

    const [allRoles] = useGetAllRolesQuery();

    const modalUpdateUser = useDisclosure();

    const customOnOpenUpdateUser = (): void => {
        modalUpdateUser.onOpen();
    };

    useEffect(() => {
        if (users.fetching && allRoles.fetching) return;

        if (allRoles.data) {
            setRoles(allRoles.data);
        }

        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3em");
            setNavBarWidth("50px");
            reexecuteQuery({ requestPolicy: "cache-and-network" });
        }
    }, [users.fetching, allRoles.fetching, expanded, activeUsers, countUpdate]);

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
                transition="0.5s"
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
                <Flex p={2} m={2} justifyContent="flex-end">
                    <Tooltip
                        hasArrow
                        aria-label="list disabled/enabled users"
                        label="List Enabled/Disabled users"
                        colorScheme="withe"
                    >
                        <Button
                            onClick={() => {
                                setActiveUsers(!activeUsers);
                            }}
                            mr={2}
                        >
                            {activeUsers ? "Disabled?" : "Activated?"}
                        </Button>
                    </Tooltip>
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
                            onClick={() => {
                                setContext("create");
                                customOnOpenUpdateUser();
                                setSelectedUser(null);
                            }}
                        />
                    </Tooltip>
                </Flex>

                {users.data?.getAllUsers?.users ? (
                    <Flex p={2} m={2}>
                        <Table variant="striped" size="sm">
                            <Thead>
                                <Tr>
                                    <Th>Profile</Th>
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
                                        <Td>
                                            {
                                                <Image
                                                    boxSize="40px"
                                                    borderRadius="full"
                                                    src={getServerPathImage(
                                                        user.picture
                                                    )}
                                                />
                                            }
                                        </Td>
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
                                                        setContext("update");
                                                        customOnOpenUpdateUser();
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
            <ModalManagerUpdateCreate
                context={context}
                user={seletedUser}
                isOpen={modalUpdateUser.isOpen}
                roles={roles}
                onClose={modalUpdateUser.onClose}
                countUpdate={countUpdate}
                updateCallback={updatedCallback}
            />
        </Container>
    );

    return users.fetching ? <FullPageSpinner /> : content;
};

export default Manage;
