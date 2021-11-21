import React from "react";
import { useColorMode, IconButton, Tooltip } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
interface ButtonColorModeProps {
    position?: any;
    top?: string;
    right?: string;
    size?: "lg" | "md" | "sm";
}

const ButtonColorMode: React.FC<ButtonColorModeProps> = ({
    position,
    top,
    right,
    size,
}) => {
    const { toggleColorMode, colorMode } = useColorMode();

    const handleDarkMode = () => {
        toggleColorMode();
    };

    const LightTheme: ReactJSXElement = (
        <Tooltip
            hasArrow
            aria-label="Switch to dark mode"
            label="Switch To Dark Mode"
            colorScheme="withe"
        >
            <IconButton
                position={position}
                top={top}
                right={right}
                color="black"
                aria-label="Light theme"
                onClick={handleDarkMode}
                size={size}
                isRound={true}
                colorScheme={"yellow"}
                icon={<SunIcon />}
            />
        </Tooltip>
    );

    const DarkTheme: ReactJSXElement = (
        <Tooltip
            hasArrow
            aria-label="Switch to light mode"
            label="Switch To Light Mode"
            colorScheme="withe"
        >
            <IconButton
                position={position}
                top={top}
                right={right}
                color="black"
                aria-label="Dark theme"
                onClick={handleDarkMode}
                size={size}
                isRound={true}
                colorScheme={"grey"}
                icon={<MoonIcon />}
            />
        </Tooltip>
    );

    return colorMode === "dark" ? DarkTheme : LightTheme;
};
export default ButtonColorMode;
