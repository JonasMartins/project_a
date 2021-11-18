import {
    Box,
    Button,
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useDrag } from "react-dnd";
import { AiOutlineEye } from "react-icons/ai";
import { MdDragHandle } from "react-icons/md";
import ModalShowItem from "../modal/ModalShowItem";
import { Item } from "./../../generated/graphql";
import { truncateString } from "./../../helpers/generalUtilitiesFunctions";
import {
    getItemTypeIcon,
    returnPriorityIconHeaderModal,
} from "./../../helpers/items/ItemFunctinHelpers";
import { Primary } from "./../layout/ContainerShades";

type itemQuery = {
    __typename?: "Item";
} & Pick<
    Item,
    "id" | "description" | "summary" | "status" | "priority" | "type"
>;

interface ItemSprintBoxProps {
    item: itemQuery;
    draggable?: boolean;
    onClick?: () => void;
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

    const modalShowItem = useDisclosure();

    const customOnOpenShowItemModal = (): void => {
        modalShowItem.onOpen();
    };

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
                    <Text size="md">{truncateString(item.summary, 15)}</Text>
                    <MdDragHandle />
                </Flex>
                <Flex flexDir="row" justifyContent="space-between">
                    <Flex flexDir="row">
                        {getItemTypeIcon(item.type)}
                        {returnPriorityIconHeaderModal(item.priority)}
                    </Flex>
                </Flex>
                <Flex justifyContent="flex-end">
                    <Tooltip
                        hasArrow
                        aria-label="See item details"
                        label="See item details"
                        colorScheme="withe"
                    >
                        <IconButton
                            isRound={true}
                            aria-label="Item Details"
                            mr={1}
                            icon={<AiOutlineEye />}
                            onClick={() => {
                                customOnOpenShowItemModal();
                            }}
                        />
                    </Tooltip>
                </Flex>
            </Primary>
            <ModalShowItem
                item={item}
                isOpen={modalShowItem.isOpen}
                onClose={modalShowItem.onClose}
            />
        </Box>
    );
};

export default ItemSprintBox;
