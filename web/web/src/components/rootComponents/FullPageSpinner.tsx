import React from "react";
import { Spinner, Box, Flex, useColorMode } from "@chakra-ui/react";
interface SpinnerProps {}

const FullPageSpinner: React.FC<SpinnerProps> = ({}) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.50", dark: "gray.700" };
    const color = { light: "black", dark: "white" };

    return (
        <Flex
            direction="column"
            bg={bgColor[colorMode]}
            color={color[colorMode]}
        >
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Spinner size="xl" />
            </Box>
        </Flex>
    );
};
export default FullPageSpinner;
