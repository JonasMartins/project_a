import React, { useContext, useEffect, useState, ChangeEvent } from "react";
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
    useToast,
    Switch,
    IconButton,
} from "@chakra-ui/react";
import { Form, Formik, Field } from "formik";
import Avatar from "react-avatar";
import Login from "./login";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import {
    useGetUserSettingsQuery,
    useGetAllRolesQuery,
    GetAllRolesQuery,
    useUpdateSeetingsUserMutation,
} from "./../generated/graphql";
import { useRouter } from "next/dist/client/router";
import { compareTwoStrings } from "./../helpers/generalUtilitiesFunctions";
import { toErrorMap } from "../utils/toErrorMap";
import SideBar from "../components/layout/SideBar";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

interface settingsProps {}

interface userInfo {
    id: string;
    name: string;
    email: string;
    passowrd: string;
    role_id: string;
}

const Settings: React.FC<settingsProps> = ({}) => {
    const { userId } = useContext(GlobalContext);

    const toast = useToast();
    const router = useRouter();

    const [loadingCount, setLoadingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [changePassword, setChangePassword] = useState(false);

    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [roles, setRoles] = useState<GetAllRolesQuery | null>(null);

    const [expand, setExpand] = useState(true);
    const [sideBarWidth, setSideBarWidth] = useState("0px");
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("0px");

    const handleExpandSideBar = (): void => {
        setExpand(!expand);

        if (expand) {
            setSideBarWidth("250px");
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setSideBarWidth("0px");
            setPageWidth("3em");
            setNavBarWidth("0px");
        }
    };

    const [userInfo, setUserInfo] = useState<userInfo>({
        id: "",
        name: "",
        email: "",
        passowrd: "",
        role_id: "",
    });

    const [{ data, fetching, error }, reexecuteQuery] = useGetUserSettingsQuery(
        {
            variables: {
                id: userId ? userId : "-1",
            },
        }
    );

    const [{}, updateSeetingsUser] = useUpdateSeetingsUserMutation();

    const [allRoles] = useGetAllRolesQuery();

    const forceDataAndStateReady = (): void => {
        console.log("user ", userInfo);
        // console.log("isAdmin ? ", userIsAdmin);
        // console.log("times executed: ", loadingCount);
        if (loadingCount < 20 && loading) {
            setLoadingCount(loadingCount + 1);
        }

        if (userInfo.name && userInfo.role_id && userInfo.email) {
            // console.log(`vars: ${userInfo.name}, ${userInfo.role_id}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetching && allRoles.fetching) return;

        if (
            data?.getUserSettings?.user?.name &&
            roles?.getAllRoles?.roles?.length
        ) {
            setUserInfo((prevUser) => ({
                ...prevUser,
                id: userId,
                name: data?.getUserSettings?.user?.name,
                email: data?.getUserSettings?.user?.email,
                passowrd: "",
                role_id: data?.getUserSettings?.user?.role?.id,
            }));

            // setPrevPassword(data?.getUserSettings?.user?.password);
        }

        setUserIsAdmin(
            compareTwoStrings(data?.getUserSettings?.user?.role.name, "Admin")
        );

        if (allRoles.data) {
            setRoles(allRoles.data);
        }

        forceDataAndStateReady();

        reexecuteQuery({ requestPolicy: "cache-and-network" });
    }, [fetching, allRoles.fetching, loadingCount, userId]);

    const handlerUpdateUser = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInfo((prevUser) => ({
            ...prevUser,
            [e.target.name]: e.target.value,
        }));
    };

    if (error) return <p>Oh no... {error.message}</p>;

    const content = loading ? (
        <FullPageSpinner />
    ) : (
        <Container>
            <Navbar pageWidth={navBarWidth} />
            <SideBar
                width={sideBarWidth}
                visibility={expand ? "hidden" : "visible"}
            />
            <Flex
                flexDir="row"
                p={3}
                mb="150px"
                justifyContent="flex-start"
                ml={pageWidth}
                transition="0.3s"
            >
                <Flex mt={2}>
                    <IconButton
                        isRound={true}
                        aria-label="Show Side Bar"
                        mr={1}
                        icon={expand ? <ArrowLeftIcon /> : <ArrowRightIcon />}
                        onClick={handleExpandSideBar}
                    />
                </Flex>
                {data && data?.getUserSettings?.user?.picure ? (
                    <Flex
                        mt={5}
                        flexDir="column"
                        alignItems="center"
                        justifyContent="flex-start"
                        flexGrow={1}
                    >
                        <Image
                            boxSize="150px"
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
                        }}
                        enableReinitialize={true}
                        onSubmit={async (values, { setErrors }) => {
                            //console.log("values ", values);
                            const response = await updateSeetingsUser({
                                options: values,
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
