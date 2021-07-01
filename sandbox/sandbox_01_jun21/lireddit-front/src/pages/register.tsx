import React from "react";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useMutation } from "urql";

interface registerProps {}

const REGISTER_MUTATION: string = `
    mutation Register($user: String, $password: String) {
        register(options: {
            username: $username
            password: $password
            }){
            errors {
                field
                message
            }, 
            user {
                username
                id
                createdAt
            }
        }
    }

`;

const Register: React.FC<registerProps> = ({}) => {
    const [{}, register] = useMutation(REGISTER_MUTATION);
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values) => {
                    const response = await register(values);
                }}
            >
                {(props) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="username"
                            label="User Name"
                        />
                        <Box mt={4}>
                            <InputField
                                name="password"
                                placeholder="password"
                                label="Password"
                                type="password"
                            />
                        </Box>
                        <Button
                            type="submit"
                            mt={4}
                            colorScheme="teal"
                            isLoading={props.isSubmitting}
                        >
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default Register;
