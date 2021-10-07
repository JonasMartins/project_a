import { Box, Flex, IconButton } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import Footer from "./../components/rootComponents/Footer";
import HomeNotifications from "../components/HomeNotifications";
import { GlobalContext } from "./../context/globalContext";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import Login from "./../pages/login";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import SideBar from "../components/layout/SideBar";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
    const { loading, userId, setCurrentUserId } = useContext(GlobalContext);

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
        try {
            localStorage.userId
                ? setCurrentUserId(localStorage.userId)
                : setCurrentUserId("");
        } catch (e) {
            console.error("err", e);
        }
    }, []);
    const content = userId ? (
        <>
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

                    <HomeNotifications />
                </Flex>
                <Box id="footer">
                    <Footer />
                </Box>
            </Container>
        </>
    ) : (
        <>
            <Login />
        </>
    );

    const spinner = <FullPageSpinner />;

    return loading ? spinner : content;
};

export default Index;
