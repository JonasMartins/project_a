import { Flex } from "@chakra-ui/react";
import React from "react";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import ButtonColorMode from "../components/ButtonColorMode";
import HomeNotifications from "../components/HomeNotifications";
interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
    return (
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
};

export default Index;
