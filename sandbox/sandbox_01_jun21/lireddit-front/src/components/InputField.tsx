import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import { FieldHookConfig, useField } from "formik";
import React from "react";

type InputFieldProps = FieldHookConfig<any> & {
    label: string;
    name: string;
    type?: string;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
    const [field, { error }] = useField(props);

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
            <Input {...field} id={field.name} type={props.type} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};
