import { useState, useEffect } from "react";
import { useToken } from "./useToken";

type user = {
    userId: string;
    role: string;
    name: string;
    iat: number;
    exp: number;
};

export const useUser = (): user => {
    const [token] = useToken();
    const getPayloadFromToken = (token: string) => {
        const encodedPayload = token.split(".")[1];
        return JSON.parse(window.atob(encodedPayload));
    };

    const [user, setUser] = useState(() => {
        if (!token) return null;
        return getPayloadFromToken(token);
    });

    useEffect(() => {
        if (!token) {
            setUser(null);
        } else {
            setUser(getPayloadFromToken(token));
        }
    }, [token]);

    return user;
};
