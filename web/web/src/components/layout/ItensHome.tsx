import React, { useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useGetItensRelatedToUserByPeriodQuery } from "./../../generated/graphql";
import { getPastOrFutureDate } from "./../../helpers/generalUtilitiesFunctions";

interface ItensHomeProps {
    userId: string;
}

const ItensHome: React.FC<ItensHomeProps> = ({ userId }) => {
    const today = new Date();
    const lastYear = getPastOrFutureDate(today, 365, "past");

    const [{ data, fetching, error }, reexecuteQuery] =
        useGetItensRelatedToUserByPeriodQuery({
            variables: {
                limit: 5,
                userId,
                createdAfter: lastYear.toDateString(),
                createdLater: today.toDateString(),
            },
            pause: true,
        });

    useEffect(() => {
        if (fetching) return;

        // Set up to refetch in one second, if the query is idle
        // const timerId = setTimeout(() => {
        //     reexecuteQuery({ requestPolicy: "cache-only" });
        // }, 1000);

        // return () => clearTimeout(timerId);
        reexecuteQuery({ requestPolicy: "cache-first" });
    }, [fetching, reexecuteQuery]);

    if (error) return <p>Oh no... {error.message}</p>;

    console.log("data", data);

    const loading = <></>;
    const content = (
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

    return fetching ? loading : content;
};

export default ItensHome;
