import React from "react";
import {
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
} from "@chakra-ui/react";
import { SettingsIcon, BellIcon, DragHandleIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
    return (
        <Box
            overflow="hidden"
            top="0"
            width="100%"
            bg="gray.900"
            m={0}
            p={[0, 2]}
        >
            <Box>
                <Icon mr={3} ml={2} as={DragHandleIcon} />
                <NextLink href="/">
                    <Link textStyle="bold" mr={2}>
                        Home
                    </Link>
                </NextLink>
                <NextLink href="/">
                    <Link textStyle="bold" mr={2}>
                        Projects
                    </Link>
                </NextLink>
                <Box float="right">
                    <Menu>
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
                            aria-label="Seetings"
                            icon={<SettingsIcon />}
                        ></MenuButton>
                        <MenuList>
                            <MenuGroup title="Profile">
                                <MenuItem>Download</MenuItem>
                                <MenuItem>Create a Copy</MenuItem>
                                <MenuItem>Mark as Draft</MenuItem>
                            </MenuGroup>
                            <MenuDivider />
                            <MenuGroup title="Help">
                                <MenuItem>Delete</MenuItem>
                                <MenuItem>Attend a Workshop</MenuItem>
                            </MenuGroup>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>
        </Box>
    );
};

export default Navbar;
