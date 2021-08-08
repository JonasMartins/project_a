import React, { createContext, useState } from "react";

export const GlobalContext = createContext<GlobalContext | null>(null);

const GlobalProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const setIsLoading = (isLoading: boolean) => {
        setLoading(isLoading);
    };

    return (
        <GlobalContext.Provider value={{ loading, setIsLoading }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
