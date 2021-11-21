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
    Stack,
    FormControl,
    FormLabel,
    Input,
    Select,
    FormErrorMessage,
    Button,
    Checkbox,
    Textarea,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import FlexSpinner from "../rootComponents/FlexSpinner";
import {
    sprintType,
    customSprintErrors,
} from "./../../utils/generalGroupTypes";
import { Field, Form, Formik } from "formik";
import {
    SprintLength,
    GetProjectsQuery,
    useCreateSprintMutation,
    useUpdateSprintMutation,
} from "./../../generated/graphql";
import { definedErrorMap } from "../../utils/toErrorMap";
enum _sprintLength {
    ONE = "One",
    TWO = "Two",
    THREE = "Three",
    FOUR = "Four",
}

interface sprintInfo {
    id: string;
    code: string;
    projectId: string;
    description: string;
    end: Date;
    length: string;
    active: string;
}

interface ModalCreateUpdateSprintProps {
    onClose: () => void;
    isOpen: boolean;
    projects: GetProjectsQuery | null;
    context: "update" | "create";
    sprint: sprintType | null;
    countUpdate: number;
    updateCallback: (number) => void;
}

const ModalCreateUpdateSprint: React.FC<ModalCreateUpdateSprintProps> = ({
    isOpen,
    onClose,
    context,
    projects,
    sprint,
    updateCallback,
    countUpdate,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const [sprintInfo, setSprintInfo] = useState<sprintInfo>({
        id: sprint?.sprint?.id,
        code: sprint?.sprint?.code,
        projectId: sprint?.sprint?.project?.id,
        description: sprint?.sprint?.description,
        end: sprint?.sprint?.final,
        length: sprint?.sprint?.length,
        active: sprint?.sprint?.active ? "active" : "",
    });

    const [customErrors, setCustonErrors] = useState<customSprintErrors>({
        code: "",
        project_id: "",
        description: "",
    });

    const [{}, createSprint] = useCreateSprintMutation();
    const [{}, updateSprint] = useUpdateSprintMutation();

    const handlerUpdateSprint = (e: ChangeEvent<HTMLInputElement>) => {
        setCustonErrors((prevErrors) => ({
            ...prevErrors,
            code: "",
            project_id: "",
            description: "",
        }));

        setSprintInfo((prevSprint) => ({
            ...prevSprint,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if (!sprint) {
            setSprintInfo((prevSprint) => ({
                ...prevSprint,
                id: "",
                code: "",
                projectId: "",
                description: "",
                end: null,
                length: "",
                active: "active",
            }));
        } else {
            setSprintInfo((prevSprint) => ({
                ...prevSprint,
                id: sprint?.sprint?.id,
                code: sprint?.sprint?.code,
                projectId: sprint?.sprint?.project?.id,
                description: sprint?.sprint?.description,
                end: sprint?.sprint?.final,
                length: sprint?.sprint?.length,
                active: sprint?.sprint?.active ? "active" : "",
            }));
        }
    }, [sprint]);

    useEffect(() => {
        return () => {
            setSprintInfo((prevSprint) => ({
                ...prevSprint,
                id: "",
                code: "",
                projectId: "",
                end: null,
                length: "",
                description: "",
                active: "active",
            }));
            setCustonErrors({
                code: "",
                project_id: "",
                description: "",
            });
        };
    }, []);

    const content = (
        <React.Fragment>
            <ModalCloseButton color={color[colorMode]} />
            <ModalBody>
                <Flex p={2} m={2} justifyContent="center" flexGrow={1}>
                    <Formik
                        initialValues={{
                            id: sprintInfo.id,
                            code: sprintInfo.code,
                            project_id: sprintInfo.projectId,
                            description: sprintInfo.description,
                            length: sprintInfo.length,
                            active: sprintInfo.active ? true : false,
                        }}
                        enableReinitialize={true}
                        onSubmit={async (values) => {
                            setLoading(true);
                            if (context === "update") {
                                const response = await updateSprint({
                                    id: values.id,
                                    active: values.active,
                                    options: {
                                        code: values.code,
                                        description: values.description,
                                        length: SprintLength[
                                            _sprintLength[values.length]
                                        ],
                                        project_id: values.project_id,
                                    },
                                });

                                if (response.data?.updateSprint?.errors) {
                                    let result = definedErrorMap(
                                        response.data?.updateSprint?.errors
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
                                            title: "Sprint Updated",
                                            description:
                                                "Sprint successfully updated",
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
                                const response = await createSprint({
                                    options: {
                                        code: values.code,
                                        description: values.description,
                                        project_id: values.project_id,
                                        length: SprintLength[
                                            _sprintLength[values.length]
                                        ],
                                    },
                                });

                                if (response.data?.createSprint?.errors) {
                                    let result = definedErrorMap(
                                        response.data?.createSprint?.errors
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
                                            title: "Sprint Created",
                                            description:
                                                "Sprint successfully created",
                                            status: "success",
                                            duration: 8000,
                                            isClosable: true,
                                            position: "bottom-right",
                                        });
                                        setLoading(false);
                                        onClose();
                                    }, 500);
                                }
                            }
                        }}
                    >
                        {(props) => (
                            <Form {...props}>
                                <Stack spacing={3}>
                                    <Field name="code">
                                        {({ field }) => (
                                            <FormControl
                                                isInvalid={!!customErrors.code}
                                            >
                                                <FormLabel htmlFor="code">
                                                    <Text
                                                        color={color[colorMode]}
                                                    >
                                                        Code
                                                    </Text>
                                                </FormLabel>
                                                <Input
                                                    {...field}
                                                    id="code"
                                                    isRequired
                                                    borderRadius="2em"
                                                    size="sm"
                                                    color={color[colorMode]}
                                                    onChange={
                                                        handlerUpdateSprint
                                                    }
                                                    value={sprintInfo.code}
                                                />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="description">
                                        {({ field }) => (
                                            <FormControl
                                                isInvalid={
                                                    !!customErrors.description
                                                }
                                            >
                                                <FormLabel htmlFor="description">
                                                    <Text
                                                        color={color[colorMode]}
                                                    >
                                                        Description
                                                    </Text>
                                                </FormLabel>
                                                <Textarea
                                                    {...field}
                                                    id="description"
                                                    isRequired
                                                    size="sm"
                                                    color={color[colorMode]}
                                                    onChange={
                                                        handlerUpdateSprint
                                                    }
                                                    value={
                                                        sprintInfo.description
                                                    }
                                                />
                                                <FormErrorMessage>
                                                    {customErrors.description}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="project">
                                        {({ field }) => (
                                            <FormControl
                                                isInvalid={
                                                    !!customErrors.project_id
                                                }
                                            >
                                                <FormLabel htmlFor="project">
                                                    <Text
                                                        color={color[colorMode]}
                                                    >
                                                        Project
                                                    </Text>
                                                </FormLabel>

                                                <Select
                                                    placeholder="project"
                                                    {...field}
                                                    id="project"
                                                    borderRadius="2em"
                                                    isRequired
                                                    size="sm"
                                                    textColor={color[colorMode]}
                                                    value={sprintInfo.projectId}
                                                    onChange={(e) => {
                                                        setCustonErrors(
                                                            (prevErrors) => ({
                                                                ...prevErrors,
                                                                project_id: "",
                                                            })
                                                        );
                                                        setSprintInfo(
                                                            (prevSprint) => ({
                                                                ...prevSprint,
                                                                projectId:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    {projects &&
                                                        projects?.getProjects?.map(
                                                            (project) => (
                                                                <option
                                                                    key={
                                                                        project.id
                                                                    }
                                                                    value={
                                                                        project.id
                                                                    }
                                                                >
                                                                    {
                                                                        project.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                </Select>

                                                <FormErrorMessage>
                                                    {customErrors.project_id}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="length">
                                        {({ field }) => (
                                            <FormControl>
                                                <FormLabel htmlFor="length">
                                                    <Text
                                                        color={color[colorMode]}
                                                    >
                                                        Length
                                                    </Text>
                                                </FormLabel>

                                                <Select
                                                    placeholder="length"
                                                    {...field}
                                                    disabled={
                                                        context === "update"
                                                    }
                                                    id="length"
                                                    borderRadius="2em"
                                                    isRequired
                                                    size="sm"
                                                    textColor={color[colorMode]}
                                                    value={sprintInfo.length}
                                                    onChange={(e) => {
                                                        setSprintInfo(
                                                            (prevSprint) => ({
                                                                ...prevSprint,
                                                                length: e.target
                                                                    .value,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <option
                                                        key={SprintLength.One}
                                                        value={SprintLength.One}
                                                    >
                                                        One Week
                                                    </option>
                                                    <option
                                                        key={SprintLength.Two}
                                                        value={SprintLength.Two}
                                                    >
                                                        Two Weeks
                                                    </option>
                                                    <option
                                                        key={SprintLength.Three}
                                                        value={
                                                            SprintLength.Three
                                                        }
                                                    >
                                                        Three Weeks
                                                    </option>
                                                    <option
                                                        key={SprintLength.Four}
                                                        value={
                                                            SprintLength.Four
                                                        }
                                                    >
                                                        Four Weeks
                                                    </option>
                                                </Select>
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
                                                    isChecked={
                                                        sprintInfo.active
                                                    }
                                                    id="active"
                                                    size="sm"
                                                    value={sprintInfo.active}
                                                    onChange={(e) => {
                                                        setSprintInfo(
                                                            (prevSprint) => ({
                                                                ...prevSprint,
                                                                active: prevSprint.active
                                                                    ? ""
                                                                    : "active",
                                                            })
                                                        );
                                                    }}
                                                />
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"inside"}
            size={"2xl"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex>
                        <Text color={color[colorMode]}>
                            {context === "create"
                                ? "Create Sprint"
                                : "Update Sprint"}
                        </Text>
                    </Flex>
                </ModalHeader>

                {loading ? <FlexSpinner /> : content}
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalCreateUpdateSprint;
