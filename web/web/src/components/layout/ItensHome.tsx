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
    Link,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useGetItensRelatedToUserByPeriodQuery } from "./../../generated/graphql";
import { getPastOrFutureDate } from "./../../helpers/generalUtilitiesFunctions";
import {
    getItemTypeIcon,
    itemRelatedToUser,
} from "./../../helpers/items/ItemFunctinHelpers";
import ModalitemDetail from "./../modal/ModalitemDetail";
import FullPageSpinner from "./../rootComponents/FullPageSpinner";
import NextLink from "next/link";

interface ItensHomeProps {
    userId: string;
}

const ItensHome: React.FC<ItensHomeProps> = ({ userId }) => {
    const [selectedItem, setSelectedItem] = useState<itemRelatedToUser>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const today = getPastOrFutureDate(new Date(), 1, "future");
    const lastYear = getPastOrFutureDate(today, 365, "past");

    const customOnOpen = (item: itemRelatedToUser): void => {
        setSelectedItem(item);
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

        reexecuteQuery({ requestPolicy: "cache-first" });
    }, [fetching, reexecuteQuery]);

    if (error) return <p>Oh no... {error.message}</p>;

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
                                    item.status !== "CLOSED" && (
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
                                                            customOnOpen(item)
                                                        }
                                                        variant="outline"
                                                        size="lg"
                                                        icon={<BsSearch />}
                                                    />
                                                </Tooltip>
                                            </Box>
                                            <NextLink
                                                href={`/project/${item.sprint.project.id}`}
                                            >
                                                <Link>
                                                    <Text fontSize="lg">
                                                        {item.summary}
                                                    </Text>
                                                </Link>
                                            </NextLink>
                                        </Flex>
                                    )
                            )}
                    </TabPanel>
                    <TabPanel>
                        {data &&
                            data.getItensRelatedToUserByPeriod.itens.map(
                                (item) =>
                                    item.status !== "COMPLETED" &&
                                    item.status !== "CLOSED" &&
                                    item.responsible_id === userId && (
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
                                                            customOnOpen(item)
                                                        }
                                                        variant="outline"
                                                        size="lg"
                                                        icon={<BsSearch />}
                                                    />
                                                </Tooltip>
                                            </Box>
                                            <NextLink
                                                href={`/project/${item.sprint.project.id}`}
                                            >
                                                <Link>
                                                    <Text fontSize="lg">
                                                        {item.summary}
                                                    </Text>
                                                </Link>
                                            </NextLink>
                                        </Flex>
                                    )
                            )}
                    </TabPanel>
                    <TabPanel>
                        {data &&
                            data.getItensRelatedToUserByPeriod.itens.map(
                                (item) => {
                                    return (
                                        item.status !== "COMPLETED" &&
                                        item.status !== "CLOSED" &&
                                        item.reporter_id === userId && (
                                            <Flex
                                                alignItems="center"
                                                key={item.id}
                                            >
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
                                                                    item
                                                                )
                                                            }
                                                            variant="outline"
                                                            size="lg"
                                                            icon={<BsSearch />}
                                                        />
                                                    </Tooltip>
                                                </Box>
                                                <NextLink
                                                    href={`/project/${item.sprint.project.id}`}
                                                >
                                                    <Link>
                                                        <Text fontSize="lg">
                                                            {item.summary}
                                                        </Text>
                                                    </Link>
                                                </NextLink>
                                            </Flex>
                                        )
                                    );
                                }
                            )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <ModalitemDetail
                isOpen={isOpen}
                onClose={onClose}
                item={selectedItem}
            />
        </>
    );

    return fetching ? loading : content;
};

export default ItensHome;
