import React, { useContext, useEffect, useState } from "react";
import Navbar from "./../components/rootComponents/Navbar";
import Footer from "./../components/rootComponents/Footer";
import { Container } from "./../components/Container";
import { GlobalContext } from "./../context/globalContext";
import {
    FormControl,
    Button,
    Text,
    FormLabel,
    Input,
    Flex,
    Image,
    Stack,
    Select,
    FormErrorMessage,
} from "@chakra-ui/react";
import { Form, Formik, Field } from "formik";
import Avatar from "react-avatar";
import Login from "./login";
import { useGetUserSettingsQuery } from "./../generated/graphql";
interface settingsProps {}

interface userInfo {
    name: string;
    email: string;
    picture: string;
    role: string;
}

const Settings: React.FC<settingsProps> = ({}) => {
    const { userId } = useContext(GlobalContext);

    const [userInfo, setUserInfo] = useState<{ user: userInfo }>({
        user: {
            name: "Name",
            email: "Email",
            picture: "",
            role: "Role",
        },
    });

    const [{ data, fetching, error }, reexecuteQuery] = useGetUserSettingsQuery(
        {
            variables: {
                id: userId,
            },
            pause: true,
        }
    );

    useEffect(() => {
        if (fetching) return;

        const _userInfo = {
            name: data?.getUserSettings?.user?.name,
            email: data?.getUserSettings?.user?.email,
            picture: data?.getUserSettings?.user?.picure,
            role: data?.getUserSettings?.user?.role?.name,
        };

        setUserInfo({ ...userInfo, user: _userInfo });

        reexecuteQuery({ requestPolicy: "cache-first" });
    }, [fetching]);

    // if (error) return <p>Oh no... {error.message}</p>;
    // /* topo | direita | inferior | esquerda */
    const content = (
        <Container>
            <Navbar />

            <Flex
                flexDir="row"
                p={3}
                m={[3, 3, 10, 3]}
                justifyContent="flex-start"
            >
                {data && data?.getUserSettings?.user?.picure ? (
                    <Flex
                        mt={5}
                        flexDir="column"
                        alignItems="center"
                        justifyContent="flex-start"
                        flexGrow={1}
                    >
                        <Image
                            boxSize="100px"
                            borderRadius="full"
                            src={data?.getUserSettings?.user?.picure}
                        />
                        <Text>{data?.getUserSettings?.user?.role?.name}</Text>
                    </Flex>
                ) : (
                    <Flex
                        mt={5}
                        flexDir="column"
                        alignItems="center"
                        justifyContent="flex-start"
                        flexGrow={0.3}
                    >
                        <Avatar
                            size="100px"
                            round={true}
                            name={
                                data?.getUserSettings?.user?.name || "Foo bar"
                            }
                        />
                        <Text>{data?.getUserSettings?.user?.role?.name}</Text>
                    </Flex>
                )}
                <Flex flexDir="column" alignItems="stretch" flexGrow={0.4}>
                    <Formik
                        initialValues={{
                            name: userInfo.user.name,
                            email: userInfo.user.email,
                            role: userInfo.user.role,
                        }}
                        onSubmit={() => {
                            console.log("submited");
                        }}
                    >
                        {(props) => (
                            <Form {...props}>
                                <Stack spacing={3}>
                                    <Field name="name">
                                        {({ field, form }) => (
                                            <FormControl
                                                isInvalid={form.errors.name}
                                            >
                                                <FormLabel htmlFor="name">
                                                    Name
                                                </FormLabel>
                                                <Input
                                                    {...field}
                                                    id="name"
                                                    borderRadius="2em"
                                                    size="lg"
                                                    value={userInfo.user.name}
                                                />
                                                <FormErrorMessage>
                                                    {form.errors.name}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="email">
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
                                                    borderRadius="2em"
                                                    size="lg"
                                                    value={userInfo.user.email}
                                                />
                                                <FormErrorMessage>
                                                    {form.errors.email}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="role">
                                        {({ field, form }) => (
                                            <FormControl
                                                isInvalid={form.errors.role}
                                            >
                                                <FormLabel htmlFor="role">
                                                    Role
                                                </FormLabel>

                                                <Select
                                                    placeholder="Role"
                                                    {...field}
                                                    id="role"
                                                    borderRadius="2em"
                                                    size="lg"
                                                >
                                                    <option value="option1">
                                                        Option 1
                                                    </option>
                                                    <option value="option2">
                                                        Option 2
                                                    </option>
                                                    <option value="option3">
                                                        Option 3
                                                    </option>
                                                </Select>

                                                <FormErrorMessage>
                                                    {form.errors.role}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Button
                                        isLoading={props.isSubmitting}
                                        type="submit"
                                        variant="cyan-gradient"
                                        borderRadius="2em"
                                        size="md"
                                        flexFlow="row"
                                        mt={4}
                                    >
                                        Save
                                    </Button>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </Flex>
            </Flex>
            <Footer />
        </Container>
    );

    return userId ? content : <Login />;
};

export default Settings;
