import { Box, Flex } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import Footer from "./../components/rootComponents/Footer";
import HomeNotifications from "../components/HomeNotifications";
import { GlobalContext } from "./../context/globalContext";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import Login from "./../pages/login";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
    const { loading, userId, setCurrentUserId } = useContext(GlobalContext);
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
                <Navbar />
                <Flex alignSelf="normal" flexGrow={1} mb="150px">
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
