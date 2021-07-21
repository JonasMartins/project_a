import React from "react";
// import { Container } from "../components/Container";
import DarkModeSwitch from "../components/DarkModeSwitch";
import { Text, Flex, useColorMode } from "@chakra-ui/react";
interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.50", dark: "gray.900" };
    const color = { light: "black", dark: "white" };

    return (
        <>
            <Flex
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                bg={bgColor[colorMode]}
                color={color[colorMode]}
                height="100vh"
            >
                <DarkModeSwitch />
                <Text color="grey.200">Example repository of</Text>
            </Flex>
        </>
    );
};
export default Login;
