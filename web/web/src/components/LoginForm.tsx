import React from "react";
import { Form, Formik, FormikValues, Field } from "formik";
import {
    FormControl,
    Button,
    FormLabel,
    Input,
    FormErrorMessage,
} from "@chakra-ui/react";
interface LoginFormProps {}

export const LoginForm: React.FC<LoginFormProps> = ({}) => {
    type errors = {
        email: string;
        password: string;
    };

    const validate = (values: FormikValues): object => {
        const error: errors = {
            email: "",
            password: "",
        };

        const regexEmail: RegExp = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;

        if (!values.email) {
            error.email = `Field Email is required`;
        }

        if (values.email && !regexEmail.test(values.email)) {
            error.email = "Invalid email";
        }

        return error;
    };

    return (
        <>
            <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        actions.setSubmitting(false);
                    }, 1000);
                }}
            >
                {(props) => (
                    <Form>
                        <Field name="email" validate={validate}>
                            {({ field, form }) => (
                                <FormControl
                                    isInvalid={
                                        form.errors.email && form.touched.email
                                    }
                                >
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <Input
                                        {...field}
                                        id="email"
                                        placeholder="email"
                                    />
                                    <FormErrorMessage>
                                        {form.errors.email}
                                    </FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>

                        <Field name="password" type="password">
                            {({ field, form }) => (
                                <FormControl
                                    isInvalid={
                                        form.errors.password &&
                                        form.touched.password
                                    }
                                >
                                    <FormLabel htmlFor="password">
                                        password
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="password"
                                        placeholder="password"
                                    />
                                    <FormErrorMessage>
                                        {form.errors.password}
                                    </FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Button
                            mt={4}
                            colorScheme="teal"
                            isLoading={props.isSubmitting}
                            type="submit"
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </>
    );
};

/*
<form onSubmit={formik.handleSubmit}>
            <label htmlFor="email">First Name</label>

            <input
                id="email"
                name="email"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.email}
            />

            {formik.errors.email ? <div>{formik.errors.email}</div> : null}
        </form>


*/
