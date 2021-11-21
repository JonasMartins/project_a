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

export const getUniqueFolderName = (): string => {
    const unit32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return unit32.toString(16);
};

export const validateEmail = (email: string): boolean => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
