import React from "react";
import { useColorMode, Switch } from "@chakra-ui/react";
interface DarkModeSwitchProps {}

const DarkModeSwitch: React.FC<DarkModeSwitchProps> = ({}) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";

    return (
        <Switch
            position="fixed"
            top="1rem"
            right="1rem"
            color="green"
            isChecked={isDark}
            onChange={toggleColorMode}
            size="lg"
            colorScheme="cyan"
        />
    );
};

export default DarkModeSwitch;
