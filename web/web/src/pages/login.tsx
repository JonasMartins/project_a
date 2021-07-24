import React from "react";
import DarkModeSwitch from "../components/DarkModeSwitch";
import { Box, Flex, Stack, useColorMode } from "@chakra-ui/react";
import { Form, Formik, Field } from "formik";
import ButtonColorMode from "./../components/ButtonColorMode";
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
        <Flex
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            bg={bgColor[colorMode]}
            color={color[colorMode]}
            height="100vh"
        >
            <ButtonColorMode />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Box boxShadow="xl" p="6" rounded="md" padding={"2em"}>
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
                                <Stack spacing={3}>
                                    <Field
                                        name="email"
                                        validade={validateEmail}
                                    >
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
                                                    borderRadius="2em"
                                                    size="lg"
                                                />
                                                <FormErrorMessage>
                                                    {form.errors
                                                        ? "ERRo"
                                                        : null}
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
                                                    borderRadius="2em"
                                                    size="lg"
                                                />
                                                <FormErrorMessage>
                                                    {form.errors.password}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Button
                                        mt="2em"
                                        isLoading={props.isSubmitting}
                                        type="submit"
                                        variant="cyan-gradient"
                                        borderRadius="2em"
                                        size="md"
                                        flexFlow="row"
                                    >
                                        Login
                                    </Button>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Box>
        </Flex>
    );
};
export default Login;
