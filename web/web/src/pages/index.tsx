import { Box, Flex } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import Footer from "./../components/rootComponents/Footer";
import HomeNotifications from "../components/HomeNotifications";
import { GlobalContext } from "./../context/globalContext";
import SideBar from "../components/layout/SideBar";
import { useUser } from "./../helpers/hooks/useUser";
import { useLogedInTestQuery } from "../generated/graphql";
interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
    const [loginTest] = useLogedInTestQuery();

    const { expanded } = useContext(GlobalContext);

    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("50px");

    const user = useUser();

    useEffect(() => {
        // executar esse metodo a tempo do campo authorization ?

        console.log("logged ? ", loginTest?.data?.logedInTest);

        if (!user) return;

        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3em");
            setNavBarWidth("50px");
        }
    }, [expanded, loginTest.fetching]);

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
