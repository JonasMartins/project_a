import React, { createContext, useState } from "react";

export const GlobalContext = createContext<GlobalContext | null>(null);

const GlobalProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [colorMode, setColorMode] = useState<"dark" | "light">("dark");

    const setIsLoading = (isLoading: boolean) => {
        setLoading(isLoading);
    };

    const setCurrentUserName = (currentUserName: string) => {
        setUserName(currentUserName);
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
                userName,
                setTheme,
                setCurrentUserId,
                setIsLoading,
                setCurrentUserName,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
