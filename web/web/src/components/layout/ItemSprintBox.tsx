import React from "react";
import {
    Text,
    Flex,
    Box,
    IconButton,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import { Primary } from "./../layout/ContainerShades";
import {
    getItemTypeIcon,
    returnPriorityIconHeaderModal,
} from "./../../helpers/items/ItemFunctinHelpers";
import { Item } from "./../../generated/graphql";
import { MdDragHandle, MdBuild } from "react-icons/md";
import ModalItemManagment from "./../../components/modal/ModalItemManagment";
import { truncateString } from "./../../helpers/generalUtilitiesFunctions";

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

    const { isOpen, onOpen, onClose } = useDisclosure();

    const customOnOpenModal = (): void => {
        onOpen();
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
                    <Tooltip
                        hasArrow
                        aria-label="Manage appointments"
                        label="Manage Appointments"
                    >
                        <IconButton
                            rounded="full"
                            onClick={() => {
                                customOnOpenModal();
                            }}
                            aria-label="Manage appointments"
                            icon={<MdBuild />}
                        />
                    </Tooltip>
                </Flex>
            </Primary>
            <ModalItemManagment isOpen={isOpen} onClose={onClose} item={item} />
        </Box>
    );
};

export default ItemSprintBox;
