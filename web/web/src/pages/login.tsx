import React, { useContext } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { Form, Formik, Field } from "formik";

import {
    FormControl,
    Button,
    FormLabel,
    Input,
    FormErrorMessage,
    Image,
    Flex,
    Text,
} from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { Container } from "./../components/Container";
import ButtonColorMode from "../components/ButtonColorMode";
import { GlobalContext } from "./../context/globalContext";

interface loginProps {}

const roleCode = {
    "001": "Developer Jr 1",
    "002": "Developer Jr 2",
    "003": "Tech Leader",
    "999": "Admin",
};

const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter();
    const [{}, login] = useLoginMutation();

    const { setIsLoading } = useContext(GlobalContext);
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
        <Container>
            <ButtonColorMode size="md" position="fixed" right="1em" top="1em" />

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                flexDir="column"
            >
                <Flex alignSelf="center" flexDir="column" mt="3">
                    <Image
                        boxSize="100px"
                        src="/favicon/android-chrome-512x512.png"
                    />
                    <Text fontSize="3xl" fontWeight="semibold">
                        Project A
                    </Text>
                </Flex>
                <Box boxShadow="xl" p="6" rounded="md" padding={"2em"}>
                    <Formik
                        initialValues={{ email: "", password: "" }}
                        onSubmit={async (values, { setErrors }) => {
                            const response = await login(values);

                            if (response.data?.login.errors) {
                                setErrors(
                                    toErrorMap(response.data.login.errors)
                                );
                            } else if (
                                response.data?.login.result.accessToken
                            ) {
                                setIsLoading(false);

                                localStorage.setItem(
                                    "token",
                                    response.data?.login.result.accessToken
                                );
                                /*
                                setToken(
                                    response.data?.login?.result?.accessToken
                                );*/
                                console.log("pushed to index");
                                router.push("/");
                            }
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
                                                isInvalid={form.errors.email}
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
                                                    {form.errors.email}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="password">
                                        {({ field, form }) => (
                                            <FormControl
                                                isInvalid={form.errors.password}
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
            {/* </Flex> */}
        </Container>
    );
};
export default Login;
