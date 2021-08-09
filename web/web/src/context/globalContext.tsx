import React, { createContext, useState } from "react";

export const GlobalContext = createContext<GlobalContext | null>(null);

const GlobalProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState("");

    const setIsLoading = (isLoading: boolean) => {
        setLoading(isLoading);
    };

    const setCurrentUserId = (currentUserId: string) => {
        setUserId(currentUserId);
    };

    return (
        <GlobalContext.Provider
            value={{ loading, userId, setCurrentUserId, setIsLoading }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
