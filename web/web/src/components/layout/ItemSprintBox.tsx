import React from "react";
import { Text, Flex, Box } from "@chakra-ui/react";
import { Primary } from "./../layout/ContainerShades";
import {
    getItemTypeIcon,
    returnPriorityIconHeaderModal,
} from "./../../helpers/items/ItemFunctinHelpers";
import { Item } from "./../../generated/graphql";

import { useDrag } from "react-dnd";

type itemQuery = {
    __typename?: "Item";
} & Pick<
    Item,
    "id" | "description" | "summary" | "status" | "priority" | "type"
>;

interface ItemSprintBoxProps {
    item: itemQuery;
    draggable?: boolean;
}

const ItemSprintBox: React.FC<ItemSprintBoxProps> = ({ item }) => {
    const [{ isDragging }, dragRef] = useDrag({
        type: "item",
        item: item,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <Box ref={dragRef}>
            <Primary
                minH="100px"
                mt="20px"
                mb="10px"
                p={2}
                flexDir="column"
                justifyContent="space-between"
            >
                <Text size="md">{item.summary}</Text>
                <Flex flexDir="row">
                    {getItemTypeIcon(item.type)}
                    {returnPriorityIconHeaderModal(item.priority)}
                </Flex>
            </Primary>
        </Box>
    );
};

export default ItemSprintBox;
