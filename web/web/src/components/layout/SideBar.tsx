import React from "react";
import { Box, useColorMode, Text, Flex } from "@chakra-ui/react";
import { SiCodesandbox } from "react-icons/si";

interface SideBarProps {
    projectName?: string;
    width: string;
    visibility: "visible" | "hidden";
}

const SideBar: React.FC<SideBarProps> = ({
    projectName,
    width,
    visibility,
}) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.50", dark: "gray.700" };
    const color = { light: "black", dark: "white" };

    return (
        <Box
            h="100%"
            overflowY="hidden"
            overflowX="hidden"
            transition="0.3s"
            pt="5"
            w={width}
            bg={bgColor[colorMode]}
            color={color[colorMode]}
            boxShadow="lg"
            position="fixed"
            mt="0px"
        >
            <Flex
                visibility={visibility}
                p={2}
                mt={7}
                flexDirection="column"
                alignItems="center"
            >
                <Box mb={3}>
                    <SiCodesandbox size="35px" />
                </Box>

                {projectName && (
                    <React.Fragment>
                        <Text fontSize="2xl">{projectName}</Text>
                        <Text fontSize="lg">Software project</Text>{" "}
                    </React.Fragment>
                )}
            </Flex>
        </Box>
    );
};

export default SideBar;
