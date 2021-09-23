import React from "react";
import { Text, Flex, Box, IconButton, Tooltip } from "@chakra-ui/react";
import { Primary } from "./../layout/ContainerShades";
import {
    getItemTypeIcon,
    returnPriorityIconHeaderModal,
} from "./../../helpers/items/ItemFunctinHelpers";
import { Item } from "./../../generated/graphql";
import { MdDragHandle, MdBuild } from "react-icons/md";

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
    const [{ isDragging, opacity }, dragRef] = useDrag({
        type: "item",
        item: item,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            opacity: 1,
        }),
    });

    return (
        <Box
            ref={dragRef}
            border={isDragging ? "1px dashed" : "none"}
            opacity={opacity}
            cursor="move"
        >
            <Primary
                minH="100px"
                mt="20px"
                mb="10px"
                p={2}
                flexDir="column"
                justifyContent="space-between"
            >
                <Flex flexDir="row" justifyContent="space-between">
                    <Text size="md">{item.summary.substr(0, 20)}</Text>
                    <MdDragHandle />
                </Flex>
                <Flex flexDir="row" justifyContent="space-between">
                    <Flex flexDir="row">
                        {getItemTypeIcon(item.type)}
                        {returnPriorityIconHeaderModal(item.priority)}
                    </Flex>
                    <Tooltip
                        hasArrow
                        aria-label="Manage appointments"
                        label="Manage Appointments"
                    >
                        <IconButton
                            rounded="full"
                            aria-label="Manage appointments"
                            icon={<MdBuild />}
                        />
                    </Tooltip>
                </Flex>
            </Primary>
        </Box>
    );
};

export default ItemSprintBox;
