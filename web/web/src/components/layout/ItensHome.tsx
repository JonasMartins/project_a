import {
    Box,
    Flex,
    IconButton,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useGetItensRelatedToUserByPeriodQuery } from "./../../generated/graphql";
import { getPastOrFutureDate } from "./../../helpers/generalUtilitiesFunctions";
import {
    enumItemPriority,
    enumItemType,
    getItemTypeIcon,
} from "./../../helpers/items/ItemFunctinHelpers";
import ModalitemDetail from "./../modal/ModalitemDetail";
import FullPageSpinner from "./../rootComponents/FullPageSpinner";

interface ItensHomeProps {
    userId: string;
}

const ItensHome: React.FC<ItensHomeProps> = ({ userId }) => {
    const [summary, setSummary] = useState("");
    const [description, setDescription] = useState("");
    const [itemType, setItemType] = useState<enumItemType | null>(null);
    const [itemPriority, setItemPriority] = useState<enumItemPriority | null>(
        null
    );

    const { isOpen, onOpen, onClose } = useDisclosure();

    const today = getPastOrFutureDate(new Date(), 1, "future");
    const lastYear = getPastOrFutureDate(today, 365, "past");

    const customOnOpen = (
        summary: string,
        description: string,
        type: enumItemType,
        priority: enumItemPriority
    ): void => {
        setDescription(description);
        setSummary(summary);
        setItemType(type);
        setItemPriority(priority);
        onOpen();
    };

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

    // console.log("data", data);

    const loading = <FullPageSpinner />;
    const content = (
        <>
            <Tabs>
                <TabList>
                    <Tab>
                        <Text fontSize="lg">Itens workd</Text>
                    </Tab>
                    <Tab>
                        <Text fontSize="lg">Attributed to me</Text>
                    </Tab>
                    <Tab>
                        <Text fontSize="lg">Created By Me</Text>
                    </Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        {data &&
                            data.getItensRelatedToUserByPeriod.itens.map(
                                (item) =>
                                    item.status !== "COMPLETED" &&
                                    item.status !== "CLOSED" ? (
                                        <Flex alignItems="center" key={item.id}>
                                            {getItemTypeIcon(item.type)}
                                            <Box ml="1em" mr="1em">
                                                <Tooltip
                                                    hasArrow
                                                    aria-label="Open Details"
                                                    label="Open Details"
                                                    colorScheme="withe"
                                                    placement="right"
                                                >
                                                    <IconButton
                                                        rounded="full"
                                                        aria-label="See Item Details"
                                                        onClick={() =>
                                                            customOnOpen(
                                                                item.summary,
                                                                item.description,
                                                                enumItemType[
                                                                    item.type
                                                                ],
                                                                enumItemPriority[
                                                                    item
                                                                        .priority
                                                                ]
                                                            )
                                                        }
                                                        variant="outline"
                                                        size="lg"
                                                        icon={<BsSearch />}
                                                    />
                                                </Tooltip>
                                            </Box>
                                            <Text fontSize="lg">
                                                {item.summary}
                                            </Text>
                                        </Flex>
                                    ) : (
                                        <React.Fragment></React.Fragment>
                                    )
                            )}
                    </TabPanel>
                    <TabPanel>
                        {data &&
                            data.getItensRelatedToUserByPeriod.itens.map(
                                (item) =>
                                    item.status !== "COMPLETED" &&
                                    item.status !== "CLOSED" &&
                                    item.responsible_id === userId ? (
                                        <Flex alignItems="center" key={item.id}>
                                            {getItemTypeIcon(item.type)}

                                            <Box ml="1em" mr="1em">
                                                <Tooltip
                                                    hasArrow
                                                    aria-label="Open Details"
                                                    label="Open Details"
                                                    colorScheme="withe"
                                                    placement="right"
                                                >
                                                    <IconButton
                                                        rounded="full"
                                                        aria-label="See Item Details"
                                                        onClick={() =>
                                                            customOnOpen(
                                                                item.summary,
                                                                item.description,
                                                                enumItemType[
                                                                    item.type
                                                                ],
                                                                enumItemPriority[
                                                                    item
                                                                        .priority
                                                                ]
                                                            )
                                                        }
                                                        variant="outline"
                                                        size="lg"
                                                        icon={<BsSearch />}
                                                    />
                                                </Tooltip>
                                            </Box>
                                            <Text fontSize="lg">
                                                {item.summary}
                                            </Text>
                                        </Flex>
                                    ) : (
                                        <React.Fragment></React.Fragment>
                                    )
                            )}
                    </TabPanel>
                    <TabPanel>
                        {data &&
                            data.getItensRelatedToUserByPeriod.itens.map(
                                (item) =>
                                    item.status !== "COMPLETED" &&
                                    item.status !== "CLOSED" &&
                                    item.reporter_id === userId ? (
                                        <Flex alignItems="center" key={item.id}>
                                            {getItemTypeIcon(item.type)}

                                            <Box ml="1em" mr="1em">
                                                <Tooltip
                                                    hasArrow
                                                    aria-label="Open Details"
                                                    label="Open Details"
                                                    colorScheme="withe"
                                                    placement="right"
                                                >
                                                    <IconButton
                                                        rounded="full"
                                                        aria-label="See Item Details"
                                                        onClick={() =>
                                                            customOnOpen(
                                                                item.summary,
                                                                item.description,
                                                                enumItemType[
                                                                    item.type
                                                                ],
                                                                enumItemPriority[
                                                                    item
                                                                        .priority
                                                                ]
                                                            )
                                                        }
                                                        variant="outline"
                                                        size="lg"
                                                        icon={<BsSearch />}
                                                    />
                                                </Tooltip>
                                            </Box>
                                            <Text fontSize="lg">
                                                {item.summary}
                                            </Text>
                                        </Flex>
                                    ) : (
                                        <React.Fragment></React.Fragment>
                                    )
                            )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <ModalitemDetail
                isOpen={isOpen}
                onClose={onClose}
                summary={summary}
                description={description}
                type={itemType}
                priority={itemPriority}
            />
        </>
    );

    return fetching ? loading : content;
};

export default ItensHome;
