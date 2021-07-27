import React from "react";
import { Flex, useColorMode } from "@chakra-ui/react";

interface ContainerProps {}

export const Container: React.FC<ContainerProps> = ({ children }) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.50", dark: "gray.700" };
    const color = { light: "black", dark: "white" };

    return (
        <Flex
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            bg={bgColor[colorMode]}
            color={color[colorMode]}
        >
            {children}
        </Flex>
    );
};
