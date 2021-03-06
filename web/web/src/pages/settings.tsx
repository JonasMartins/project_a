import { Container } from "./../components/Container";
import Navbar from "./../components/rootComponents/Navbar";
import Footer from "./../components/rootComponents/Footer";
import { GlobalContext } from "./../context/globalContext";
import React, { useContext, useEffect, useState, ChangeEvent } from "react";
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
    useToast,
    Switch,
} from "@chakra-ui/react";
import Avatar from "react-avatar";
import { Form, Formik, Field } from "formik";
import {
    GetAllRolesQuery,
    useGetAllRolesQuery,
    useGetUserSettingsQuery,
    useUpdateSeetingsUserMutation,
} from "./../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import SideBar from "../components/layout/SideBar";
import { useRouter } from "next/dist/client/router";
import { useUser } from "./../helpers/hooks/useUser";
import { compareTwoStrings } from "./../helpers/generalUtilitiesFunctions";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import { getServerPathImage } from "./../utils/handleServerImagePaths";

interface settingsProps {}

interface userInfo {
    id: string;
    name: string;
    email: string;
    passowrd: string;
    role_id: string;
    file: File;
}

const Settings: React.FC<settingsProps> = ({}) => {
    const { expanded } = useContext(GlobalContext);

    const user = useUser();

    const toast = useToast();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [pageWidth, setPageWidth] = useState("3em");
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [navBarWidth, setNavBarWidth] = useState("50px");
    const [changePassword, setChangePassword] = useState(false);
    const [roles, setRoles] = useState<GetAllRolesQuery | null>(null);

    const [userInfo, setUserInfo] = useState<userInfo>({
        id: "",
        name: "",
        email: "",
        passowrd: "",
        role_id: "",
        file: null,
    });

    const [{ data, fetching }, reexecuteQuery] = useGetUserSettingsQuery({
        variables: {
            id: user && user.userId ? user.userId : "-1",
        },
        pause: !user || !user.userId,
    });

    const [{}, updateSeetingsUser] = useUpdateSeetingsUserMutation();

    const [allRoles] = useGetAllRolesQuery();

    useEffect(() => {
        reexecuteQuery({ requestPolicy: "network-only" });
    }, []);

    useEffect(() => {
        if (fetching && allRoles.fetching) return;
        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3em");
            setNavBarWidth("50px");
        }
        if (data?.getUserSettings?.user) {
            setUserInfo((prevUser) => ({
                ...prevUser,
                id: data?.getUserSettings?.user?.id,
                name: data?.getUserSettings?.user?.name,
                email: data?.getUserSettings?.user?.email,
                passowrd: "",
                role_id: data?.getUserSettings?.user?.role?.id,
            }));
            setLoading(false);
        }

        setUserIsAdmin(
            compareTwoStrings(data?.getUserSettings?.user?.role.name, "Admin")
        );

        if (allRoles.data) {
            setRoles(allRoles.data);
        }

        reexecuteQuery({ requestPolicy: "cache-and-network" });
    }, [fetching, allRoles.fetching, expanded, user, loading]);

    useEffect(() => {
        return () => {
            setUserInfo((prevUser) => ({
                ...prevUser,
                id: "",
                name: "",
                email: "",
                passowrd: "",
                role_id: "",
            }));
        };
    }, []);

    const handlerUpdateUser = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInfo((prevUser) => ({
            ...prevUser,
            [e.target.name]: e.target.value,
        }));
    };

    // if (error) return <p>Oh no... {error.message}</p>;

    const content = loading ? (
        <FullPageSpinner />
    ) : (
        <Container>
            <Navbar pageWidth={navBarWidth} />
            <SideBar />
            <Flex
                flexDir="row"
                p={3}
                mb="150px"
                justifyContent="flex-start"
                ml={pageWidth}
                transition="0.3s"
            >
                {data && data?.getUserSettings?.user?.picture ? (
                    <Flex
                        mt={5}
                        flexDir="column"
                        alignItems="center"
                        justifyContent="flex-start"
                        flexGrow={0.3}
                    >
                        <Image
                            boxSize="150px"
                            borderRadius="full"
                            border="1px solid grey"
                            src={getServerPathImage(
                                data?.getUserSettings?.user?.picture
                            )}
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
                            size="150px"
                            round={true}
                            name={
                                data?.getUserSettings?.user?.name || "Foo bar"
                            }
                        />
                        <Text>{data?.getUserSettings?.user?.role?.name}</Text>
                    </Flex>
                )}
                <Flex flexDir="column" alignItems="stretch" flexGrow={0.4}>
                    <Flex justifyContent="flex-end">
                        <Switch
                            size="sm"
                            mr={3}
                            onChange={() => {
                                setChangePassword(!changePassword);
                            }}
                        />
                        <Text>Change Password ?</Text>
                    </Flex>
                    <Formik
                        initialValues={{
                            id: userInfo.id,
                            name: userInfo.name,
                            email: userInfo.email,
                            password: userInfo.passowrd,
                            role_id: userInfo.role_id,
                            file: userInfo.file,
                        }}
                        enableReinitialize={true}
                        onSubmit={async (values, { setErrors }) => {
                            const response = await updateSeetingsUser({
                                id: values.id,
                                name: values.name,
                                email: values.email,
                                password: values.password,
                                role_id: values.role_id,
                                file: values.file,
                                active: true,
                            });

                            if (response.data?.updateSeetingsUser?.errors) {
                                setErrors(
                                    toErrorMap(
                                        response.data.updateSeetingsUser.errors
                                    )
                                );
                            } else {
                                toast({
                                    title: "User Updated",
                                    description: "User successfully updatde",
                                    status: "success",
                                    duration: 8000,
                                    isClosable: true,
                                    position: "bottom-right",
                                });
                                router.push("/");
                            }
                        }}
                    >
                        {(props, isSubmitting) => (
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
                                                    isDisabled={!userIsAdmin}
                                                    {...field}
                                                    id="name"
                                                    borderRadius="2em"
                                                    size="lg"
                                                    onChange={handlerUpdateUser}
                                                    value={userInfo.name}
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
                                                    isDisabled={!userIsAdmin}
                                                    {...field}
                                                    id="email"
                                                    borderRadius="2em"
                                                    size="lg"
                                                    onChange={handlerUpdateUser}
                                                    value={userInfo.email}
                                                />
                                                <FormErrorMessage>
                                                    {form.errors.email}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>

                                    {changePassword ? (
                                        <Field name="password">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={
                                                        form.errors.password
                                                    }
                                                >
                                                    <FormLabel htmlFor="password">
                                                        Password
                                                    </FormLabel>
                                                    <Input
                                                        placeholder="Insert new Password"
                                                        type="password"
                                                        {...field}
                                                        id="password"
                                                        borderRadius="2em"
                                                        size="lg"
                                                        onChange={(e) => {
                                                            setUserInfo(
                                                                (
                                                                    prevUserInfo
                                                                ) => ({
                                                                    ...prevUserInfo,
                                                                    passowrd:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            );
                                                        }}
                                                        value={
                                                            userInfo.passowrd
                                                        }
                                                    />
                                                    <FormErrorMessage>
                                                        {form.errors.password}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                    ) : (
                                        <></>
                                    )}

                                    <Field name="role">
                                        {({ field, form }) => (
                                            <FormControl
                                                isInvalid={form.errors.role}
                                            >
                                                <FormLabel htmlFor="role">
                                                    Role
                                                </FormLabel>

                                                <Select
                                                    isDisabled={!userIsAdmin}
                                                    placeholder="Role"
                                                    {...field}
                                                    id="role"
                                                    borderRadius="2em"
                                                    size="lg"
                                                    value={userInfo.role_id}
                                                    onChange={(e) => {
                                                        setUserInfo(
                                                            (prevUserInfo) => ({
                                                                ...prevUserInfo,
                                                                role_id:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    {roles &&
                                                        roles?.getAllRoles?.roles?.map(
                                                            (role) => (
                                                                <option
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    value={
                                                                        role.id
                                                                    }
                                                                >
                                                                    {role.name}
                                                                </option>
                                                            )
                                                        )}
                                                </Select>

                                                <FormErrorMessage>
                                                    {form.errors.role}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="picture">
                                        {({ field, form }) => (
                                            <FormControl
                                                isInvalid={form.errors.picture}
                                            >
                                                <FormLabel htmlFor="picture">
                                                    Profile
                                                </FormLabel>
                                                <Input
                                                    {...field}
                                                    type="file"
                                                    accept="image/*"
                                                    id="picture"
                                                    onChange={({
                                                        target: {
                                                            validity,
                                                            files,
                                                        },
                                                    }) => {
                                                        if (
                                                            validity.valid &&
                                                            files
                                                        ) {
                                                            props.setFieldValue(
                                                                "file",
                                                                files[0]
                                                            );
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Button
                                        disabled={isSubmitting}
                                        isLoading={isSubmitting}
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

    return content;
};

export default Settings;
