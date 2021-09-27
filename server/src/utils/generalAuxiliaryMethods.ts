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

    if (!field || !method) {
        err = {
            field: "-",
            message: "Must pass field, method and path, as arguments",
            method: "-",
        };
    } else {
        err = {
            field,
            message: message + ` Field: ( ${field} ) at, ${path}`,
            method,
        };
    }

    arrError.push(err);

    return arrError;
};

export const getPastOrFutureDate = (
    begin: Date,
    days: number,
    type: "future" | "past"
): Date => {
    const futureOrPastDate = new Date();

    if (type === "past") {
        futureOrPastDate.setDate(begin.getDate() - days);
    } else {
        futureOrPastDate.setDate(begin.getDate() + days);
    }

    return futureOrPastDate;
};
