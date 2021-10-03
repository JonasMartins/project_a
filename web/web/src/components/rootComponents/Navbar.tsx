import React, { useContext, useState, useEffect } from "react";
import {
    useColorMode,
    Icon,
    Box,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    IconButton,
    MenuDivider,
    MenuGroup,
    Link,
    Text,
    Flex,
    useDisclosure,
} from "@chakra-ui/react";
import { SettingsIcon, BellIcon, DragHandleIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useRouter } from "next/dist/client/router";
import { GlobalContext } from "./../../context/globalContext";
import Avatar from "react-avatar";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { SiCodesandbox } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { BsGear, BsBook } from "react-icons/bs";
import ModalAboutProject from "./../modal/ModalAboutProject";
interface NavbarProps {
    pageWidth?: string;
}

const Navbar: React.FC<NavbarProps> = ({ pageWidth }) => {
    const router = useRouter();

    const { setIsLoading, setCurrentUserId, setTheme, userName } =
        useContext(GlobalContext);

    const { toggleColorMode } = useColorMode();
    const [darkMode, setDarkMode] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {}, [userName]);

    const handleDarkMode = () => {
        setDarkMode(!darkMode);
        setTheme(darkMode ? "dark" : "light");
        toggleColorMode();
    };

    const logout = () => {
        setIsLoading(true);
        setTimeout(() => {
            localStorage.clear();
        }, 600);
        setCurrentUserId("");
        router.push("/login");
    };

    const content = (
        <Flex
            overflow="hidden"
            top="0"
            zIndex={1}
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
                        <Avatar
                            name={userName || "Foo Bar"}
                            size="40px"
                            round={true}
                        />
                    </Box>
                    <Box mr={2}>
                        <IconButton
                            aria-label="Switch Theme"
                            isRound={true}
                            isActive={darkMode}
                            onClick={handleDarkMode}
                            colorScheme={darkMode ? "grey" : "yellow"}
                            icon={darkMode ? <MoonIcon /> : <SunIcon />}
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
                                icon={<AiOutlineLogout />}
                                onClick={logout}
                            >
                                Logout
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    router.push("/settings");
                                }}
                                icon={<BsGear />}
                            >
                                Settings
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
