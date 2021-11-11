import { Box, Flex, useToast } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import Footer from "./../components/rootComponents/Footer";
import HomeNotifications from "../components/HomeNotifications";
import { GlobalContext } from "./../context/globalContext";
import SideBar from "../components/layout/SideBar";
import { useLogedInTestQuery } from "../generated/graphql";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import Login from "./login";
import { useRouter } from "next/dist/client/router";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
    const [loginTest] = useLogedInTestQuery();
    const toast = useToast();
    const router = useRouter();

    const { expanded } = useContext(GlobalContext);

    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("50px");

    useEffect(() => {
        if (loginTest?.fetching) {
            return;
        }

        if (loginTest?.data?.logedInTest?.errors) {
            toast({
                title: "Not Authorized",
                description: "Please Log in to access this page",
                status: "error",
                duration: 8000,
                isClosable: true,
                position: "bottom-right",
            });
            router.push("/login");
        }

        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3em");
            setNavBarWidth("50px");
        }
    }, [expanded, loginTest.fetching]);

    const content = loginTest?.data?.logedInTest?.errors ? (
        <Login />
    ) : (
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

    return loginTest.fetching ? <FullPageSpinner /> : content;
};

export default Index;
