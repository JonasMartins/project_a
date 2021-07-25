import {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Flex,
} from "@chakra-ui/react";
import React from "react";
import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
    return (
        <>
            <Container>
                <Navbar />
            </Container>
            <Flex alignSelf="flex-start">
                <Tabs
                    size="md"
                    variant="line"
                    orientation="horizontal"
                    align="start"
                    flexGrow={1}
                >
                    <TabList>
                        <Tab>One</Tab>
                        <Tab>Two</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <p>one!</p>
                        </TabPanel>
                        <TabPanel>
                            <p>two!</p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </>
    );
};

export default Index;
