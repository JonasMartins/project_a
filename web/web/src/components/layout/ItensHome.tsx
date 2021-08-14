import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
interface ItensHomeProps {}

const ItensHome: React.FC<ItensHomeProps> = ({}) => {
    return (
        <Tabs>
            <TabList>
                <Tab>Itens workd</Tab>
                <Tab>Attributed to me</Tab>
                <Tab>Created By Me</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <p>one!</p>
                </TabPanel>
                <TabPanel>
                    <p>two!</p>
                </TabPanel>
                <TabPanel>
                    <p>three!</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

export default ItensHome;
