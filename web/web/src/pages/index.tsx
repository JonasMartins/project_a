import { Box, Flex } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import Footer from "./../components/rootComponents/Footer";
import HomeNotifications from "../components/HomeNotifications";
import { GlobalContext } from "./../context/globalContext";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import Login from "./../pages/login";
import SideBar from "../components/layout/SideBar";
import { useUser } from "./../helpers/hooks/useUser";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
    const { loading, expanded } = useContext(GlobalContext);

    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("50px");

    const user = useUser();

    useEffect(() => {
        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3em");
            setNavBarWidth("50px");
        }
    }, [loading, expanded]);

    const content =
        user && user.userId ? (
            <>
                <Container>
                    <Navbar pageWidth={navBarWidth} />
                    <SideBar />
                    <Flex
                        alignSelf="normal"
                        flexDir="column"
                        flexGrow={1}
                        mb="150px"
                        ml={pageWidth}
                        transition="0.3s"
                    >
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

    return loading ? <FullPageSpinner /> : content;
};

export default Index;
