import React from "react";
// import { Container } from "../components/Container";
import DarkModeSwitch from "../components/DarkModeSwitch";
import { Flex, useColorMode } from "@chakra-ui/react";
// import { LoginForm } from "./../components/LoginForm";
import { Form, Formik, FormikValues, Field } from "formik";
import {
    FormControl,
    Button,
    FormLabel,
    Input,
    FormErrorMessage,
} from "@chakra-ui/react";
interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.50", dark: "gray.900" };
    const color = { light: "black", dark: "white" };

    type errors = {
        email: string;
        password: string;
    };

    const validateEmail = (values: string): string => {
        let error = "";

        const regexEmail: RegExp = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;

        if (!values) {
            error = `Field Email is required`;
        }

        if (values && !regexEmail.test(values)) {
            error = "Invalid email";
        }

        return error;
    };

    return (
        <>
            <Flex
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                bg={bgColor[colorMode]}
                color={color[colorMode]}
                height="100vh"
            >
                <DarkModeSwitch />
                {/* <LoginForm /> */}
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
                            <Field name="email" validade={validateEmail}>
                                {({ field, form }) => (
                                    <FormControl
                                        isInvalid={
                                            form.errors.name &&
                                            form.touched.name
                                        }
                                    >
                                        <FormLabel htmlFor="email">
                                            Email
                                        </FormLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            placeholder="email"
                                        />
                                        <FormErrorMessage>
                                            {form.errors ? "ERRo" : null}
                                            {console.log(form.errors)}
                                        </FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>

                            <Field name="password">
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
                                            type="password"
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
            </Flex>
        </>
    );
};
export default Login;
