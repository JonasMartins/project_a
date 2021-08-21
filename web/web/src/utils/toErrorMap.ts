import { ErrorFieldHandler } from "../generated/graphql";

export const toErrorMap = (errors: ErrorFieldHandler[]) => {
    const errorMap: Record<string, string> = {};
    errors.forEach(({ field, message }) => {
        errorMap[field] = message;
    });

    return errorMap;
};
