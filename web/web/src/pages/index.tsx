import { Flex } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import ButtonColorMode from "../components/ButtonColorMode";
import HomeNotifications from "../components/HomeNotifications";
import { GlobalContext } from "./../context/globalContext";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import Login from "./../pages/login";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
    const { loading, userId } = useContext(GlobalContext);

    useEffect(() => {});

    const content = userId ? (
        <>
            <Container>
                <Navbar />
                <Flex alignSelf="flex-end" p={2} mr={3}>
                    <ButtonColorMode size="sm" />
                </Flex>
                <Flex alignSelf="flex-start" flexGrow={1}>
                    <HomeNotifications />
                </Flex>
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
