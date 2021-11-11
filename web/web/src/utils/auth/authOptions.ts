import { makeOperation } from "@urql/core";

export const didAuthError = ({ error }) => {
    return error.graphQLErrors.some((e) => e.extensions?.code === "FORBIDDEN");
};

export const getAuth = async ({ authState }) => {
    console.log("window type: ", typeof window);
    if (typeof window !== "undefined") {
        if (!authState) {
            console.log("here ? ", localStorage);
            const token = localStorage.getItem("token");
            if (token) {
                console.log("token ", token);
                return { token };
            }
            return null;
        }
        console.log("no token, redirecting to login, ", authState);
    }
    return null;
};

export const addAuthToOperation = ({ authState, operation }) => {
    console.log("--", authState);
    console.log("wt ", typeof window);
    if (!authState || !authState.token) {
        return operation;
    }

    console.log("middle?", authState);

    const fetchOptions =
        typeof operation.context.fetchOptions === "function"
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {};

    console.log("->", authState);

    return makeOperation(operation.kind, operation, {
        ...operation.context,
        fetchOptions: {
            ...fetchOptions,
            headers: {
                ...fetchOptions.headers,
                Authorization: authState.token,
            },
        },
    });
};
