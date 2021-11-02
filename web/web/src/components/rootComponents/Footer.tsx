import React from "react";
import { Text, Flex, Box, useColorMode, Image } from "@chakra-ui/react";
interface FooterProps {}

const Footer: React.FC<FooterProps> = ({}) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.800" };
    const color = { light: "black", dark: "white" };
    /* topo | direita | inferior | esquerda */

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
            <Flex alignItems="center" mb={2}>
                <Image
                    boxSize="100px"
                    src="/favicon/android-chrome-512x512.png"
                />
                <Text fontSize="3xl" fontWeight="semibold" ml={2}>
                    Project A
                </Text>
                <Box p="3" ml={2}>
                    <Text>@Copyright 2021</Text>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Footer;
