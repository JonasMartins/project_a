import React from "react";
import { Flex, useColorMode } from "@chakra-ui/react";

interface StatusItemDraggableProps {}

const StatusItemDraggable: React.FC<StatusItemDraggableProps> = ({
    children,
}) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.800" };
    const color = { light: "black", dark: "white" };

    return (
        <Flex
            minH="150px"
            flexGrow={1}
            boxShadow="lg"
            flexDir="column"
            p={3}
            m="2em 2em 20em 0"
            bg={bgColor[colorMode]}
            color={color[colorMode]}
        >
            {children}
        </Flex>
    );
};

export default StatusItemDraggable;
