import { Box, Flex, useToast } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import React, { useContext, useEffect, useState } from "react";
import HomeNotifications from "../components/HomeNotifications";
import SideBar from "../components/layout/SideBar";
import { Container } from "./../components/Container";
import Footer from "./../components/rootComponents/Footer";
import Navbar from "./../components/rootComponents/Navbar";
import { GlobalContext } from "./../context/globalContext";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
    const { expanded } = useContext(GlobalContext);
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("50px");

    useEffect(() => {
        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3em");
            setNavBarWidth("50px");
        }
    }, [expanded]);

    const content = (
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
    );

    return content;
};

export default Index;
