import React from "react";
import { Text, Flex, Box } from "@chakra-ui/react";
interface FooterProps {}

const Footer: React.FC<FooterProps> = ({}) => {
    return (
        <Flex
            justifyContent="flex-end"
            minHeight="100vh"
            m={0}
            boxShadow="lg"
            alignItems="center"
            flexDirection="column"
            flexGrow={1}
        >
            <Box p="3">
                <Text>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    In, voluptas. Suscipit illum deleniti perferendis dolores
                    error! A voluptates porro molestiae recusandae pariatur eum
                    rem asperiores totam dolore placeat, repellat cumque?
                </Text>
            </Box>
        </Flex>
    );
};

export default Footer;
