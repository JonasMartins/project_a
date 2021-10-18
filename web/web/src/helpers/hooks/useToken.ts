import { useState } from "react";

export const useToken = () => {
    const [token, setTokenInternal] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token");
        } else {
            return "";
        }
    });

    const setToken = (newToken: string): void => {
        localStorage.setItem("token", newToken);
        setTokenInternal(newToken);
    };

    return [token, setToken] as const;
};
