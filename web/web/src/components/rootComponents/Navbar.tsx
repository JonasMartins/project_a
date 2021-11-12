import {
    BellIcon,
    DragHandleIcon,
    MoonIcon,
    SettingsIcon,
    SunIcon,
} from "@chakra-ui/icons";
import {
    Box,
    Flex,
    Icon,
    IconButton,
    Image,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Text,
    useColorMode,
    useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import NextLink from "next/link";
import React, { useContext } from "react";
import Avatar from "react-avatar";
import { AiOutlineLogout } from "react-icons/ai";
import { BsBook, BsGear } from "react-icons/bs";
import { SiCodesandbox } from "react-icons/si";
import { GlobalContext } from "./../../context/globalContext";
import { useUser } from "./../../helpers/hooks/useUser";
import { getServerPathImage } from "./../../utils/handleServerImagePaths";
import ModalAboutProject from "./../modal/ModalAboutProject";

interface NavbarProps {
    pageWidth?: string;
}

const Navbar: React.FC<NavbarProps> = ({ pageWidth }) => {
    const router = useRouter();

    // reexecuteQuery({ requestPolicy: "network-only" });

    const { setIsLoading, setCurrentUserId } = useContext(GlobalContext);

    const user = useUser();

    const { toggleColorMode, colorMode } = useColorMode();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleDarkMode = () => {
        toggleColorMode();
    };

    const logout = () => {
        setIsLoading(false);
        localStorage.clear();
        setCurrentUserId("");
        router.push("/login");
    };

    const content = (
        <Flex
            overflow="hidden"
            top="0"
            zIndex={0}
            flexGrow={1}
            m={0}
            p={[0, 2]}
            ml={pageWidth ? pageWidth : "0px"}
            boxShadow="lg"
            justifyContent="space-between"
            transition="0.3s"
        >
            <Flex justifyContent="flex-start" alignItems="center">
                <Icon mr={3} ml={2} as={DragHandleIcon} />
                <Box mr={3} ml={1}>
                    <SiCodesandbox />
                </Box>
                <Text mr={2}>Project A - Software</Text>

                <NextLink href="/">
                    <Link textStyle="bold" mr={2}>
                        Home
                    </Link>
                </NextLink>
                <NextLink href="/project">
                    <Link textStyle="bold" mr={2}>
                        Projects
                    </Link>
                </NextLink>
            </Flex>
            <Flex justifyContent="flex-end">
                <Menu>
                    <Box mr={2}>
                        {user && user.picture ? (
                            <Image
                                borderRadius="full"
                                boxSize="40px"
                                src={getServerPathImage(user.picture)}
                            />
                        ) : (
                            <Avatar
                                name={(user && user.name) || "Foo Bar"}
                                size="40px"
                                round={true}
                            />
                        )}
                    </Box>
                    <Box mr={2}>
                        <IconButton
                            aria-label="Switch Theme"
                            isRound={true}
                            onClick={handleDarkMode}
                            colorScheme={
                                colorMode === "dark" ? "grey" : "yellow"
                            }
                            icon={
                                colorMode === "dark" ? (
                                    <MoonIcon />
                                ) : (
                                    <SunIcon />
                                )
                            }
                        />
                    </Box>

                    <MenuButton
                        mr={2}
                        borderRadius={"full"}
                        as={IconButton}
                        aria-label="Notifications"
                        icon={<BellIcon />}
                    ></MenuButton>
                    <MenuList>
                        <MenuItem>Download</MenuItem>
                        <MenuItem>Create a Copy</MenuItem>
                        <MenuItem></MenuItem>
                        <MenuItem>Delete</MenuItem>
                        <MenuItem>Attend a Workshop</MenuItem>
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton
                        mr={2}
                        borderRadius={"full"}
                        as={IconButton}
                        aria-label="Settings"
                        icon={<SettingsIcon />}
                    ></MenuButton>
                    <MenuList>
                        <MenuGroup title="Profile">
                            <MenuItem
                                onClick={() => {
                                    router.push("/settings");
                                }}
                                icon={<BsGear />}
                            >
                                Settings
                            </MenuItem>
                            <MenuItem
                                icon={<AiOutlineLogout />}
                                onClick={logout}
                            >
                                Logout
                            </MenuItem>
                        </MenuGroup>
                        <MenuDivider />
                        <MenuGroup title="Help">
                            <MenuItem onClick={onOpen} icon={<BsBook />}>
                                About this project
                            </MenuItem>
                        </MenuGroup>
                    </MenuList>
                </Menu>
            </Flex>
            <ModalAboutProject isOpen={isOpen} onClose={onClose} />
        </Flex>
    );

    return content;
};

export default Navbar;
