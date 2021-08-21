// type error = {
//     field: String;
//     message: String;
//     method: String;
// };

import { ErrorFieldHandler } from "../utils/errorFieldHandler";

export const genericError = (
    field: string,
    method: string,
    path: string,
    message: string
): ErrorFieldHandler[] => {
    let arrError: ErrorFieldHandler[] = [];
    let err: ErrorFieldHandler = {
        field: "",
        message: "",
        method: "",
    };

    if (!field || !method || path) {
        err = {
            field: "-",
            message: "Must pass field, method and path, as arguments",
            method: "-",
        };
    } else {
        err = {
            field,
            message,
            method: `Field: ${field} at, ${path}`,
        };
    }

    arrError.push;

    return arrError;
};
