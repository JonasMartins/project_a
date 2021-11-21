import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Stack,
    Text,
    useColorMode,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
    GetAllRolesQuery,
    useCreateUserMutation,
    useUpdateSeetingsUserMutation,
} from "../../generated/graphql";
import {
    generateRandomPassword,
    userManageInfo,
} from "../../helpers/users/userFunctonHelpers";
import { getServerPathImage } from "../../utils/handleServerImagePaths";
import { definedErrorMap } from "../../utils/toErrorMap";
import FlexSpinner from "./../rootComponents/FlexSpinner";
import ModalCopyNewUsersPassword from "./ModalCopyNewUsersPassword";

interface ModalManagerUpdateCreateUserProps {
    onClose: () => void;
    isOpen: boolean;
    user: userManageInfo | null;
    roles: GetAllRolesQuery | null;
    countUpdate: number;
    updateCallback: (number) => void;
    context: "update" | "create";
}

interface userInfo {
    id: string;
    name: string;
    email: string;
    role_id: string;
    active: string;
    picture: string;
}
interface customErrors {
    name: string | null;
    email: string | null;
    role: string | null;
}

const ModalManagerUpdateCreate: React.FC<ModalManagerUpdateCreateUserProps> = ({
    isOpen,
    onClose,
    user,
    roles,
    countUpdate,
    updateCallback,
    context,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [hasSubmit, setHasSubmit] = useState(0);
    const [userInfo, setUserInfo] = useState<userInfo>({
        id: user?.user?.id,
        name: user?.user?.name,
        email: user?.user?.email,
        role_id: user?.user?.role?.id,
        active: user?.user?.active ? "active" : "",
        picture: user?.user?.picture,
    });
    const [randomPassword, setRandomPassword] = useState("");

    const [{}, updateSeetingsUser] = useUpdateSeetingsUserMutation();
    const [{}, createUser] = useCreateUserMutation();

    const [customErrors, setCustonErrors] = useState<customErrors>({
        name: "",
        email: "",
        role: "",
    });

    const modalCopyUserPassword = useDisclosure();

    const handlerUpdateUser = (e: ChangeEvent<HTMLInputElement>) => {
        setCustonErrors((prevErrors) => ({
            ...prevErrors,
            name: "",
            email: "",
            role: "",
        }));

        setUserInfo((prevUser) => ({
            ...prevUser,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if (!user) {
            setUserInfo((prevUser) => ({
                ...prevUser,
                id: "",
                name: "",
                email: "",
                role_id: "",
                active: "active",
                picture: "",
            }));
        } else {
            // if (!userInfo.name) {
            setUserInfo((prevUser) => ({
                ...prevUser,
                id: user?.user?.id,
                name: user?.user?.name,
                email: user?.user?.email,
                role_id: user?.user?.role?.id,
                active: user?.user?.active ? "active" : "",
                picture: user?.user?.picture,
            }));
            // }
        }
    }, [user, hasSubmit]);

    useEffect(() => {
        return () => {
            setHasSubmit(0);
            setUserInfo((prevUser) => ({
                ...prevUser,
                id: "",
                name: "",
                email: "",
                role_id: "",
                active: "active",
                picture: "",
            }));
            setCustonErrors({
                name: "",
                email: "",
                role: "",
            });
        };
    }, []);

    const content = (
        <React.Fragment>
            <ModalCloseButton color={color[colorMode]} />
            <ModalBody>
                <Flex p={2} m={2} justifyContent="center">
                    <Image
                        boxSize="80px"
                        borderRadius="full"
                        src={getServerPathImage(user?.user.picture)}
                    />
                </Flex>
                <Flex p={2} m={2} justifyContent="center">
                    <Formik
                        initialValues={{
                            id: userInfo.id,
                            name: userInfo.name,
                            email: userInfo.email,
                            role_id: userInfo.role_id,
                            active: userInfo.active ? true : false,
                        }}
                        enableReinitialize={true}
                        onSubmit={async (values, { setErrors }) => {
                            setLoading(true);
                            if (context === "update") {
                                const response = await updateSeetingsUser({
                                    id: values.id,
                                    name: values.name,
                                    email: values.email,
                                    password: "",
                                    role_id: values.role_id,
                                    file: null,
                                    active: values.active,
                                });

                                if (response.data?.updateSeetingsUser?.errors) {
                                    let result = definedErrorMap(
                                        response.data?.updateSeetingsUser
                                            ?.errors
                                    );

                                    setCustonErrors((prevErrors) => ({
                                        ...prevErrors,
                                        [result[0]["field"]]:
                                            result[0]["message"],
                                    }));

                                    setTimeout(() => {
                                        setLoading(false);
                                    }, 300);
                                } else {
                                    setTimeout(() => {
                                        updateCallback(countUpdate + 1);
                                        toast({
                                            title: "User Updated",
                                            description:
                                                "User successfully updated",
                                            status: "success",
                                            duration: 8000,
                                            isClosable: true,
                                            position: "bottom-right",
                                        });
                                        setLoading(false);
                                        onClose();
                                    }, 500);
                                }
                            } else {
                                setRandomPassword(generateRandomPassword(8));

                                const response = await createUser({
                                    name: values.name,
                                    email: values.email,
                                    password: randomPassword,
                                    role_id: values.role_id,
                                });

                                if (response.data?.createUser?.errors) {
                                    let result = definedErrorMap(
                                        response.data?.createUser?.errors
                                    );

                                    setCustonErrors((prevErrors) => ({
                                        ...prevErrors,
                                        [result[0]["field"]]:
                                            result[0]["message"],
                                    }));

                                    setTimeout(() => {
                                        setLoading(false);
                                    }, 300);
                                } else {
                                    setTimeout(() => {
                                        onClose();
                                        modalCopyUserPassword.onOpen();
                                        setLoading(false);
                                        updateCallback(countUpdate + 1);
                                    }, 500);
                                }
                            }
                        }}
                    >
                        {(props) => (
                            <Form {...props}>
                                <Stack spacing={3}>
                                    <Field name="name">
                                        {({ field }) => (
                                            <FormControl
                                                isInvalid={!!customErrors.name}
                                            >
                                                <FormLabel htmlFor="name">
                                                    <Text
                                                        color={color[colorMode]}
                                                    >
                                                        Name
                                                    </Text>
                                                </FormLabel>
                                                <Input
                                                    {...field}
                                                    id="name"
                                                    isRequired
                                                    borderRadius="2em"
                                                    size="sm"
                                                    color={color[colorMode]}
                                                    onChange={handlerUpdateUser}
                                                    value={userInfo.name}
                                                />
                                                <FormErrorMessage>
                                                    {customErrors.name}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="email">
                                        {({ field, form }) => (
                                            <FormControl
                                                isInvalid={!!customErrors.email}
                                            >
                                                <FormLabel htmlFor="email">
                                                    <Text
                                                        color={color[colorMode]}
                                                    >
                                                        Email
                                                    </Text>
                                                </FormLabel>
                                                <Input
                                                    {...field}
                                                    id="email"
                                                    borderRadius="2em"
                                                    size="sm"
                                                    color={color[colorMode]}
                                                    onChange={handlerUpdateUser}
                                                    value={userInfo.email}
                                                />
                                                <FormErrorMessage>
                                                    {customErrors.email}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="active">
                                        {({ field, form }) => (
                                            <FormControl
                                                isInvalid={form.errors.active}
                                            >
                                                <FormLabel htmlFor="active">
                                                    <Text
                                                        color={color[colorMode]}
                                                    >
                                                        Active ?
                                                    </Text>
                                                </FormLabel>
                                                <Checkbox
                                                    {...field}
                                                    isChecked={userInfo.active}
                                                    id="active"
                                                    size="sm"
                                                    value={userInfo.active}
                                                    onChange={(e) => {
                                                        setUserInfo(
                                                            (prevUserInfo) => ({
                                                                ...prevUserInfo,
                                                                active: prevUserInfo.active
                                                                    ? ""
                                                                    : "active",
                                                            })
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="role">
                                        {({ field, form }) => (
                                            <FormControl
                                                isInvalid={!!customErrors.role}
                                            >
                                                <FormLabel htmlFor="role">
                                                    <Text
                                                        color={color[colorMode]}
                                                    >
                                                        Role
                                                    </Text>
                                                </FormLabel>

                                                <Select
                                                    placeholder="Role"
                                                    {...field}
                                                    id="role"
                                                    borderRadius="2em"
                                                    isRequired
                                                    size="sm"
                                                    textColor={color[colorMode]}
                                                    value={userInfo.role_id}
                                                    onChange={(e) => {
                                                        setCustonErrors(
                                                            (prevErrors) => ({
                                                                ...prevErrors,
                                                                role: "",
                                                            })
                                                        );
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
                                                    {customErrors.role}
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
            </ModalBody>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior={"inside"}
                size={"lg"}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Flex>
                            <Text color={color[colorMode]}>{`${
                                context === "create" ? "Create" : "Update"
                            }  ${
                                user?.user?.name ? user?.user?.name : "User"
                            }`}</Text>
                        </Flex>
                    </ModalHeader>
                    {loading ? <FlexSpinner /> : content}
                    <ModalFooter>
                        <ModalBody></ModalBody>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <ModalCopyNewUsersPassword
                isOpen={modalCopyUserPassword.isOpen}
                onClose={modalCopyUserPassword.onClose}
                password={randomPassword}
                textColor={color[colorMode]}
            />
        </React.Fragment>
    );
};

export default ModalManagerUpdateCreate;
