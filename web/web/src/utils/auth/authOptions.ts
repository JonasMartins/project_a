import { makeOperation } from "@urql/core";

export const routesWithRoles = [
    {
        route: "manage",
        roles: ["admin"],
    },
];
export const didAuthError = ({ error }) => {
    return error.graphQLErrors.some((e) => e.extensions?.code === "FORBIDDEN");
};

export const willAuthError = ({ authState }) => {
    if (!authState) return true;
    return false;
};

export const getAuth = async ({ authState }) => {
    if (typeof window !== "undefined") {
        if (!authState) {
            const token = localStorage.getItem("token");
            if (token) {
                return { token };
            }
            return null;
        }
    }
    return null;
};

export const addAuthToOperation = ({ authState, operation }) => {
    if (!authState || !authState.token) {
        return operation;
    }

    const fetchOptions =
        typeof operation.context.fetchOptions === "function"
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {};

    // console.log("->", authState);

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
