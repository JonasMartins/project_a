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
    Stack,
    useColorMode,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Button,
    Select,
} from "@chakra-ui/react";
import React, { useState, ChangeEvent } from "react";
import { Form, Formik, Field } from "formik";
import {
    useCreateUserMutation,
    GetAllRolesQuery,
} from "./../../generated/graphql";
import { generateRandomPassword } from "./../../helpers/users/userFunctonHelpers";

interface ModalManagerCreateUserProps {
    onClose: () => void;
    isOpen: boolean;
    roles: GetAllRolesQuery | null;
}

interface userInput {
    create_name: string;
    create_email: string;
    create_role_id: string;
}

const ModalManagerCreateUser: React.FC<ModalManagerCreateUserProps> = ({
    isOpen,
    onClose,
    roles,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };
    const [randomPassword, setRandomPassword] = useState("");

    setRandomPassword(generateRandomPassword(8));

    const [userInput, setUserInput] = useState<userInput>({
        create_name: "",
        create_email: "",
        create_role_id: "",
    });

    const handleCreateUser = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInput((prevUser) => ({
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
                        <Text color={color[colorMode]}>CreateUser</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton color={color[colorMode]} />
                <ModalBody>
                    <Flex p={2} m={2} justifyContent="center">
                        <Formik
                            enableReinitialize={true}
                            initialValues={{
                                create_name: userInput.create_name,
                                create_email: userInput.create_email,
                                create_role_id: userInput.create_role_id,
                                create_password: randomPassword,
                            }}
                            onSubmit={(values) => {
                                console.log("values", values);
                            }}
                        >
                            {(props) => (
                                <Form {...props}>
                                    <Stack spacing={3}>
                                        <Field name="create_name">
                                            {({ field, form }) => (
                                                <FormControl
                                                // isInvalid={form.errors.name}
                                                >
                                                    <FormLabel htmlFor="create_name">
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
                                                        id="create_name"
                                                        borderRadius="2em"
                                                        size="sm"
                                                        color={color[colorMode]}
                                                        onChange={
                                                            handleCreateUser
                                                        }
                                                        value={
                                                            userInput.create_name
                                                        }
                                                    />
                                                    <FormErrorMessage>
                                                        {/* {form.errors.name} */}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                        <Field name="create_email">
                                            {({ field, form }) => (
                                                <FormControl
                                                // isInvalid={
                                                //     form.errors.email
                                                // }
                                                >
                                                    <FormLabel htmlFor="create_email">
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
                                                        id="create_email"
                                                        borderRadius="2em"
                                                        size="sm"
                                                        color={color[colorMode]}
                                                        onChange={
                                                            handleCreateUser
                                                        }
                                                        value={
                                                            userInput.create_email
                                                        }
                                                    />
                                                    <FormErrorMessage>
                                                        {/* {form.errors.email} */}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                        <Field name="create_role">
                                            {({ field, form }) => (
                                                <FormControl
                                                // isInvalid={form.errors.role}
                                                >
                                                    <FormLabel htmlFor="create_role">
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
                                                        id="create_role"
                                                        borderRadius="2em"
                                                        size="sm"
                                                        textColor={
                                                            color[colorMode]
                                                        }
                                                        value={
                                                            userInput.create_role_id
                                                        }
                                                        onChange={(e) => {
                                                            setUserInput(
                                                                (
                                                                    prevuserInput
                                                                ) => ({
                                                                    ...prevuserInput,
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
                                                        {/* {form.errors.role} */}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                        {/*<Button
                                            isLoading={props.isSubmitting}
                                            type="submit"
                                            variant="cyan-gradient"
                                            borderRadius="2em"
                                            size="md"
                                            flexFlow="row"
                                            mt={4}
                                        >
                                            Save
                                        </Button> */}
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

export default ModalManagerCreateUser;
