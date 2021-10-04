import React, { createContext, useState } from "react";

export const GlobalContext = createContext<GlobalContext | null>(null);

const roleCode = {
    "001": "Developer Jr 1",
    "002": "Developer Jr 2",
    "003": "Tech Leader",
    "999": "Admin",
};

const GlobalProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState("");
    const [userRole, setUserRole] = useState("");
    const [userName, setUserName] = useState("");
    const [colorMode, setColorMode] = useState<"dark" | "light">("light");

    const setIsLoading = (isLoading: boolean) => {
        setLoading(isLoading);
    };

    const setCurrentUserRole = (currentUserRole: string) => {
        setUserRole(roleCode[currentUserRole]);
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
                userRole,
                setTheme,
                setCurrentUserId,
                setIsLoading,
                setCurrentUserName,
                setCurrentUserRole,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
