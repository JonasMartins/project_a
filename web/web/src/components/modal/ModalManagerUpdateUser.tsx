import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Flex,
    useColorMode,
    useToast,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Stack,
    Checkbox,
    Image,
} from "@chakra-ui/react";
import { Form, Formik, Field } from "formik";
import { userManageInfo } from "./../../helpers/users/userFunctonHelpers";
import {
    useUpdateSeetingsUserMutation,
    GetAllRolesQuery,
    useCreateUserMutation,
} from "./../../generated/graphql";
import React, { useState, ChangeEvent, useEffect } from "react";
import { toErrorMap } from "../../utils/toErrorMap";
import { getServerPathImage } from "./../../utils/handleServerImagePaths";
import { generateRandomPassword } from "./../../helpers/users/userFunctonHelpers";

interface ModalManagerUpdateUserProps {
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

const ModalManagerUpdateUser: React.FC<ModalManagerUpdateUserProps> = ({
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

    const handlerUpdateUser = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInfo((prevUser) => ({
            ...prevUser,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        setRandomPassword(generateRandomPassword(8));

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
            setUserInfo((prevUser) => ({
                ...prevUser,
                id: user?.user?.id,
                name: user?.user?.name,
                email: user?.user?.email,
                role_id: user?.user?.role?.id,
                active: user?.user?.active ? "active" : "",
                picture: user?.user?.picture,
            }));
        }
    }, [user]);

    return (
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

                                    if (
                                        response.data?.updateSeetingsUser
                                            ?.errors
                                    ) {
                                        setErrors(
                                            toErrorMap(
                                                response.data.updateSeetingsUser
                                                    .errors
                                            )
                                        );
                                    } else {
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
                                        onClose();
                                    }
                                } else {
                                    const response = await createUser({
                                        name: values.name,
                                        email: values.email,
                                        password: randomPassword,
                                        role_id: values.role_id,
                                    });

                                    if (response.data?.createUser?.errors) {
                                        setErrors(
                                            toErrorMap(
                                                response.data.createUser.errors
                                            )
                                        );
                                    } else {
                                        toast({
                                            title: "User Created",
                                            description:
                                                "User successfully created",
                                            status: "success",
                                            duration: 8000,
                                            isClosable: true,
                                            position: "bottom-right",
                                        });
                                        onClose();
                                    }
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
                                                        <Text
                                                            color={
                                                                color[colorMode]
                                                            }
                                                        >
                                                            Name
                                                        </Text>
                                                    </FormLabel>
                                                    <Input
                                                        {...field}
                                                        id="name"
                                                        borderRadius="2em"
                                                        size="sm"
                                                        color={color[colorMode]}
                                                        onChange={
                                                            handlerUpdateUser
                                                        }
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
                                                    isInvalid={
                                                        form.errors.email
                                                    }
                                                >
                                                    <FormLabel htmlFor="email">
                                                        <Text
                                                            color={
                                                                color[colorMode]
                                                            }
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
                                                        onChange={
                                                            handlerUpdateUser
                                                        }
                                                        value={userInfo.email}
                                                    />
                                                    <FormErrorMessage>
                                                        {form.errors.email}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                        <Field name="active">
                                            {({ field, form }) => (
                                                <FormControl
                                                    isInvalid={
                                                        form.errors.active
                                                    }
                                                >
                                                    <FormLabel htmlFor="active">
                                                        <Text
                                                            color={
                                                                color[colorMode]
                                                            }
                                                        >
                                                            Active ?
                                                        </Text>
                                                    </FormLabel>
                                                    <Checkbox
                                                        {...field}
                                                        isChecked={
                                                            userInfo.active
                                                        }
                                                        id="active"
                                                        size="sm"
                                                        value={userInfo.active}
                                                        onChange={(e) => {
                                                            setUserInfo(
                                                                (
                                                                    prevUserInfo
                                                                ) => ({
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
                                                    isInvalid={form.errors.role}
                                                >
                                                    <FormLabel htmlFor="role">
                                                        <Text
                                                            color={
                                                                color[colorMode]
                                                            }
                                                        >
                                                            Role
                                                        </Text>
                                                    </FormLabel>

                                                    <Select
                                                        placeholder="Role"
                                                        {...field}
                                                        id="role"
                                                        borderRadius="2em"
                                                        size="sm"
                                                        textColor={
                                                            color[colorMode]
                                                        }
                                                        value={userInfo.role_id}
                                                        onChange={(e) => {
                                                            setUserInfo(
                                                                (
                                                                    prevUserInfo
                                                                ) => ({
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
                                                                        {
                                                                            role.name
                                                                        }
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
                </ModalBody>
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalManagerUpdateUser;
