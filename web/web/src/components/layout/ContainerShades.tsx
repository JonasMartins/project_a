import React from "react";
import { Flex, ResponsiveValue, useColorMode } from "@chakra-ui/react";

interface ContainerShadesProps {
    minH?: string;
    flexGrow?: number;
    boxShadow?: string;
    flexDir?: ResponsiveValue<"column" | "row">;
    p?: number | string;
    m?: number | string;
    mt?: number | string;
    mb?: number | string;
    ml?: number | string;
    mr?: number | string;
}

export const Primary: React.FC<ContainerShadesProps> = ({
    children,
    ...props
}) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.50", dark: "gray.700" };
    const color = { light: "black", dark: "white" };

    return (
        <Flex {...props} bg={bgColor[colorMode]} color={color[colorMode]}>
            {children}
        </Flex>
    );
};

export const Secondary: React.FC<ContainerShadesProps> = ({
    children,
    ...props
}) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.800" };
    const color = { light: "black", dark: "white" };

    return (
        <Flex {...props} bg={bgColor[colorMode]} color={color[colorMode]}>
            {children}
        </Flex>
    );
};
