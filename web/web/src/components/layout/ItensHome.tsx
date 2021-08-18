import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useGetItensRelatedToUserByPeriodQuery } from "./../../generated/graphql";
import { getPastOrFutureDate } from "./../../helpers/generalUtilitiesFunctions";

interface ItensHomeProps {
    userId: string;
}

const ItensHome: React.FC<ItensHomeProps> = ({ userId }) => {
    const today = new Date();
    const lastWeek = getPastOrFutureDate(today, 7, "past");

    const [{ data }] = useGetItensRelatedToUserByPeriodQuery({
        variables: {
            limit: 5,
            userId,
            createdAfter: lastWeek,
            createdLater: today,
        },
    });

    return (
        <Tabs>
            <TabList>
                <Tab>Itens workd</Tab>
                <Tab>Attributed to me</Tab>
                <Tab>Created By Me</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <p>
                        {data
                            ? data.getItensRelatedToUserByPeriod.itens[0]
                                  .summary
                            : "..."}
                    </p>
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
