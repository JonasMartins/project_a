import { Flex } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import ButtonColorMode from "../components/ButtonColorMode";
import HomeNotifications from "../components/HomeNotifications";
import { GlobalContext } from "./../context/globalContext";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
    const { loading } = useContext(GlobalContext);

    const content = (
        <>
            <Container>
                <Navbar />
                <Flex alignSelf="flex-end" p={2} mr={3}>
                    <ButtonColorMode size="sm" />
                </Flex>
                <Flex width="50%" alignSelf="flex-start">
                    <HomeNotifications />
                </Flex>
            </Container>
        </>
    );

    const spinner = <FullPageSpinner />;

    return loading ? spinner : content;
};

export default Index;
