import React from "react";
import { Text } from "@chakra-ui/react";
import { Primary } from "./../layout/ContainerShades";

interface ItemSprintBoxProps {
    summary: string;
}

const ItemSprintBox: React.FC<ItemSprintBoxProps> = ({ summary }) => {
    return (
        <Primary minH="100px" mt="20px" mb="10px" p={2} flexGrow={1}>
            <Text size="md">{summary}</Text>
        </Primary>
    );
};

export default ItemSprintBox;
