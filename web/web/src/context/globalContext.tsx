import React, { createContext, useState } from "react";

export const GlobalContext = createContext<GlobalContext | null>(null);

const GlobalProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState("");
    const [colorMode, setColorMode] = useState<"dark" | "light">("dark");

    const setIsLoading = (isLoading: boolean) => {
        setLoading(isLoading);
    };

    const setTheme = (theme: "dark" | "light") => {
        setColorMode(theme);
    };

    const setCurrentUserId = (currentUserId: string) => {
        setUserId(currentUserId);
    };

    return (
        <GlobalContext.Provider
            value={{
                loading,
                userId,
                colorMode,
                setTheme,
                setCurrentUserId,
                setIsLoading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
