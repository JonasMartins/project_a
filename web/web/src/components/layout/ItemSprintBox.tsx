import React from "react";
import { Text, Flex } from "@chakra-ui/react";
import { Primary } from "./../layout/ContainerShades";
import { ItemType, ItemPriority } from "./../../generated/graphql";
import {
    getItemTypeIcon,
    returnPriorityIconHeaderModal,
} from "./../../helpers/items/ItemFunctinHelpers";
interface ItemSprintBoxProps {
    summary: string;
    type: ItemType;
    priority: ItemPriority;
}

const ItemSprintBox: React.FC<ItemSprintBoxProps> = ({
    summary,
    type,
    priority,
}) => {
    return (
        <Primary
            minH="100px"
            mt="20px"
            mb="10px"
            p={2}
            flexDir="column"
            justifyContent="space-between"
        >
            <Text size="md">{summary}</Text>
            <Flex flexDir="row">
                {getItemTypeIcon(type)}
                {returnPriorityIconHeaderModal(priority)}
            </Flex>
        </Primary>
    );
};

export default ItemSprintBox;
