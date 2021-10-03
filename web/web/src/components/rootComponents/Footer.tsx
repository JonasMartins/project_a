import React from "react";
import { Text, Flex, Box, useColorMode } from "@chakra-ui/react";
interface FooterProps {}

const Footer: React.FC<FooterProps> = ({}) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.800" };
    const color = { light: "black", dark: "white" };
    return (
        <Flex
            justifyContent="flex-end"
            minHeight="50vh"
            m={0}
            boxShadow="lg"
            alignItems="center"
            flexDirection="column"
            flexGrow={1}
            bg={bgColor[colorMode]}
            color={color[colorMode]}
            // zIndex="2"
        >
            <Box p="3">
                <Text>@Copyright 2021</Text>
            </Box>
        </Flex>
    );
};

export default Footer;
