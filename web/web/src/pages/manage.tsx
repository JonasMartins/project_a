import React, { useContext, useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import SideBar from "../components/layout/SideBar";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import Footer from "./../components/rootComponents/Footer";
import Login from "./../pages/login";
import { GlobalContext } from "./../context/globalContext";
import { Box, Flex, Text, IconButton, Link, Tooltip } from "@chakra-ui/react";
import NextLink from "next/link";
import Index from "./index";
import { IoPersonAddOutline } from "react-icons/io5";
// import {FaUserEdit} from 'react-icons/fa'

interface manageProps {}

const Manage: React.FC<manageProps> = ({}) => {
    const { userId, userRole } = useContext(GlobalContext);

    const [expand, setExpand] = useState(true);
    const [sideBarWidth, setSideBarWidth] = useState("0px");
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("0px");

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
        console.log("id ", userId);
        console.log("role ", userRole);
    }, [userId, userRole]);

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
                <Flex p={2} m={2}>
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
            </Flex>
            <Box id="footer">
                <Footer />
            </Box>
        </Container>
    );

    if (userId) {
        userRole === "Admin" ? content : <Index />;
    } else {
        return <Login />;
    }

    return userId ? content : <Login />;
};

export default Manage;
