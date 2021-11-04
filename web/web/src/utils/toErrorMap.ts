import { ErrorFieldHandler } from "../generated/graphql";

interface definedError {
    field: string;
    message: string;
}

export const toErrorMap = (errors: ErrorFieldHandler[]) => {
    const errorMap: Record<string, string> = {};
    errors.forEach(({ field, message }) => {
        errorMap[field] = message;
    });
    return errorMap;
};

export const definedErrorMap = (errors: ErrorFieldHandler[]) => {
    const errorMap: definedError[] = [];
    errors.forEach(({ field, message }) => {
        errorMap.push({
            field,
            message,
        });
    });
    return errorMap;
};
