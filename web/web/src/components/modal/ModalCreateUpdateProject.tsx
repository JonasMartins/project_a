import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useColorMode,
    Flex,
    useToast,
    Input,
    Stack,
    FormLabel,
    FormControl,
    FormErrorMessage,
    Button,
    Textarea,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import FlexSpinner from "../rootComponents/FlexSpinner";
import { definedErrorMap } from "../../utils/toErrorMap";
import {
    useCreateProjectMutation,
    useUpdateProjectMutation,
} from "./../../generated/graphql";
import {
    projectType,
    projectInfo,
    customProjectErrors,
} from "./../../utils/generalGroupTypes";

interface ModalCreateUpdateProjectProps {
    onClose: () => void;
    isOpen: boolean;
    countUpdate: number;
    project: projectType | null;
    updateCallback: (number) => void;
    context: "update" | "create";
}

const ModalCreateUpdateProject: React.FC<ModalCreateUpdateProjectProps> = ({
    isOpen,
    onClose,
    countUpdate,
    project,
    updateCallback,
    context,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [hasSubmit, setHasSubmit] = useState(0);
    const [{}, updateProject] = useUpdateProjectMutation();
    const [{}, createProject] = useCreateProjectMutation();

    const [projectInfo, setProjectInfo] = useState<projectInfo>({
        id: project?.project?.id,
        name: project?.project?.name,
        description: project?.project?.name,
    });
    const [customErrors, setCustonErrors] = useState<customProjectErrors>({
        name: "",
        description: "",
    });

    const handlerUpdateProject = (e: ChangeEvent<HTMLInputElement>) => {
        setCustonErrors((prevErrors) => ({
            ...prevErrors,
            name: "",
            description: "",
        }));

        setProjectInfo((prevProject) => ({
            ...prevProject,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if (!project) {
            setProjectInfo((prevProject) => ({
                ...prevProject,
                id: "",
                name: "",
                description: "",
            }));
        } else {
            setProjectInfo((prevProject) => ({
                ...prevProject,
                id: project?.project?.id,
                name: project?.project?.name,
                description: project?.project?.description,
            }));
        }
    }, [project, hasSubmit]);

    useEffect(() => {
        return () => {
            setHasSubmit(0);
            setCustonErrors((prevErrors) => ({
                ...prevErrors,
                name: "",
                description: "",
            }));
            setProjectInfo((prevProject) => ({
                ...prevProject,
                id: "",
                name: "",
                description: "",
            }));
        };
    }, []);

    const content = (
        <React.Fragment>
            <ModalCloseButton color={color[colorMode]} />
            <ModalBody>
                <Flex p={2} m={2} justifyContent="flex-start" flexFlow="column">
                    <Formik
                        initialValues={{
                            id: projectInfo.id,
                            name: projectInfo.name,
                            description: projectInfo.description,
                        }}
                        enableReinitialize={true}
                        onSubmit={async (values) => {
                            setLoading(true);
                            if (context === "update") {
                                const response = await updateProject({
                                    id: values.id,
                                    name: values.name,
                                    description: values.description,
                                });
                                if (response.data?.updateProject?.errors) {
                                    let result = definedErrorMap(
                                        response.data?.updateProject?.errors
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
                                            title: "Project Updated",
                                            description:
                                                "Project successfully updated",
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
                                const response = await createProject({
                                    options: {
                                        name: values.name,
                                        description: values.description,
                                    },
                                });

                                if (response.data?.createProject?.errors) {
                                    let result = definedErrorMap(
                                        response.data?.createProject?.errors
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
                                            title: "Project Created",
                                            description:
                                                "Project successfully Created",
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
                                                    onChange={
                                                        handlerUpdateProject
                                                    }
                                                    value={projectInfo.name}
                                                />
                                                <FormErrorMessage>
                                                    {customErrors.name}
                                                </FormErrorMessage>
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
                                                    placeholder="Type the project's description"
                                                    size="sm"
                                                    color={color[colorMode]}
                                                    onChange={
                                                        handlerUpdateProject
                                                    }
                                                    value={
                                                        projectInfo.description
                                                    }
                                                />
                                                <FormErrorMessage>
                                                    {customErrors.description}
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
                                ? "Create Project"
                                : "Update Project"}
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

export default ModalCreateUpdateProject;
