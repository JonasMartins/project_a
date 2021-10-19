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
} from "@chakra-ui/react";
import Avatar from "react-avatar";
import { Form, Formik, Field } from "formik";
import { userManageInfo } from "./../../helpers/users/userFunctonHelpers";
import {
    useUpdateSeetingsUserMutation,
    GetAllRolesQuery,
} from "./../../generated/graphql";
import router from "next/router";
import React, { useState, ChangeEvent } from "react";
import { toErrorMap } from "../../utils/toErrorMap";

interface ModalManagerUpdateUserProps {
    onClose: () => void;
    isOpen: boolean;
    user: userManageInfo | null;
    roles: GetAllRolesQuery | null;
}

interface userInfo {
    id: string;
    name: string;
    email: string;
    role_id: string;
}

const ModalManagerUpdateUser: React.FC<ModalManagerUpdateUserProps> = ({
    isOpen,
    onClose,
    user,
    roles,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };
    const toast = useToast();

    const [userInfo, setUserInfo] = useState<userInfo>({
        id: user?.user?.id,
        name: user?.user?.name,
        email: user?.user?.email,
        role_id: user?.user?.role?.id,
    });

    const [{}, updateSeetingsUser] = useUpdateSeetingsUserMutation();

    const handlerUpdateUser = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInfo((prevUser) => ({
            ...prevUser,
            [e.target.name]: e.target.value,
        }));
    };

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
                        <Text color={color[colorMode]}>{user?.user?.name}</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex p={2} m={2} justifyContent="center">
                        <Avatar
                            name={user?.user?.name}
                            round={true}
                            size="80px"
                        />
                    </Flex>
                    <Flex p={2} m={2} justifyContent="center">
                        <Formik
                            initialValues={{
                                id: user?.user?.id,
                                name: user?.user?.name,
                                email: user?.user?.email,
                                role_id: user?.user?.role.id,
                            }}
                            enableReinitialize={true}
                            onSubmit={async (values, { setErrors }) => {
                                const response = await updateSeetingsUser({
                                    options: values,
                                });

                                if (response.data?.updateSeetingsUser?.errors) {
                                    setErrors(
                                        toErrorMap(
                                            response.data.updateSeetingsUser
                                                .errors
                                        )
                                    );
                                } else {
                                    toast({
                                        title: "User Updated",
                                        description:
                                            "User successfully updatde",
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
                                                        size="lg"
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
                                                        size="lg"
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
                                                        size="lg"
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
