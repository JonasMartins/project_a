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
    Stack,
    FormControl,
    FormLabel,
    Textarea,
    Button,
    useToast,
} from "@chakra-ui/react";
import { teamGetTeamsType } from "../../utils/generalGroupTypes";
import { Field, Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import FlexSpinner from "../rootComponents/FlexSpinner";
import { useUser } from "./../../helpers/hooks/useUser";
import { useCreateNewsMutation } from "../../generated/graphql";

type notification = {
    description: string;
    pathInfo: string;
    usersRelated: string[];
    creatorId: string;
};

interface CreateTeamsNewsProps {
    onClose: () => void;
    isOpen: boolean;
    team: teamGetTeamsType | null;
}

const CreateTeamsNews: React.FC<CreateTeamsNewsProps> = ({
    isOpen,
    onClose,
    team,
}) => {
    const user = useUser();
    const toast = useToast();
    const { colorMode } = useColorMode();
    const [loading, setLoading] = useState(false);
    const color = { light: "black", dark: "white" };
    const [{}, createNews] = useCreateNewsMutation();

    const [notification, setNotification] = useState<notification>({
        description: "",
        pathInfo: "",
        creatorId: "",
        usersRelated: [],
    });

    const getMembersIds = (): string[] => {
        let ids: string[] = [];
        if (!team) return ids;

        team.members.forEach((member) => {
            ids.push(member.id);
        });

        return ids;
    };

    useEffect(() => {
        if (!team) return;
        setNotification((prevNot) => ({
            ...prevNot,
            description: "",
            creatorId: user.userId,
            usersRelated: getMembersIds(),
            pathInfo: `Location: Home > Teams > Team: ${team.name}`,
        }));
    }, [team]);

    const content = (
        <React.Fragment>
            <ModalCloseButton color={color[colorMode]} />
            <ModalBody>
                <Flex
                    p={1}
                    m={1}
                    justifyContent="flex-start"
                    flexGrow={1}
                    flexFlow="column"
                >
                    <Formik
                        initialValues={{
                            description: notification.description,
                        }}
                        enableReinitialize={true}
                        onSubmit={async (values) => {
                            setLoading(true);
                            const response = await createNews({
                                creator_id: notification.creatorId,
                                description: values.description,
                                usersRelated: notification.usersRelated,
                                pathInfo: notification.pathInfo,
                            });

                            if (response) {
                                setTimeout(() => {
                                    toast({
                                        title: "Notification Sended",
                                        description:
                                            "Notification successfully created",
                                        status: "success",
                                        duration: 8000,
                                        isClosable: true,
                                        position: "bottom-right",
                                    });
                                    setLoading(false);
                                    onClose();
                                }, 500);
                            }
                        }}
                    >
                        {(props) => (
                            <Form {...props}>
                                <Stack spacing={3}>
                                    <Field name="description">
                                        {({ field }) => (
                                            <FormControl>
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
                                                    value={
                                                        notification.description
                                                    }
                                                    onChange={(e) => {
                                                        setNotification(
                                                            (prevNot) => ({
                                                                ...prevNot,
                                                                description:
                                                                    e.target
                                                                        .value,
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
                                    >
                                        Send
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
            onClose={() => {
                onClose();
                setNotification((prevNot) => ({
                    ...prevNot,
                    description: "",
                    creatorId: "",
                    usersRelated: [],
                    pathInfo: "",
                }));
            }}
            scrollBehavior={"inside"}
            size={"lg"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex>
                        <Text color={color[colorMode]}>
                            Send a Notification to this Team's Members
                        </Text>
                    </Flex>
                </ModalHeader>
                {loading ? <FlexSpinner /> : content}
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateTeamsNews;
