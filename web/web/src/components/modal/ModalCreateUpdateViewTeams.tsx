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
    Button,
    Textarea,
    Image,
    useDisclosure,
    Collapse,
    Tooltip,
    FormErrorMessage,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import FlexSpinner from "./../rootComponents/FlexSpinner";
import {
    teamGetTeamsType,
    membersGetTeamsType,
    customTeamErrors,
    defaultSelectPattern,
} from "./../../utils/generalGroupTypes";
import {
    useCreateTeamMutation,
    useUpdateTeamMutation,
    useGetUsersSelectQuery,
} from "./../../generated/graphql";
import { Field, Form, Formik } from "formik";
import { getServerPathImage } from "../../utils/handleServerImagePaths";
import { truncateString } from "../../helpers/generalUtilitiesFunctions";
import { definedErrorMap } from "../../utils/toErrorMap";
import Select from "react-select";

interface ModalCreateUpdateViewTeamsProps {
    onClose: () => void;
    isOpen: boolean;
    context: "update" | "create" | "view";
    team: teamGetTeamsType | null;
}

interface teamInfoType {
    id: string;
    name: string;
    description: string;
    leader_id: string;
    members: membersGetTeamsType;
}

const ModalCreateUpdateViewTeams: React.FC<ModalCreateUpdateViewTeamsProps> = ({
    isOpen,
    onClose,
    context,
    team,
}) => {
    const toast = useToast();
    const { colorMode } = useColorMode();
    const [loading, setLoading] = useState(false);
    const color = { light: "black", dark: "white" };
    const handleShowMembers = useDisclosure();

    const [teamInfo, setTeamInfo] = useState<teamInfoType>({
        id: team?.id,
        name: team?.name,
        description: team?.description,
        leader_id: team?.leader.id,
        members: team?.members,
    });

    const [customErrors, setCustomErrors] = useState<customTeamErrors>({
        id: "",
        leader_id: "",
        name: "",
        description: "",
    });

    const [{}, createTeam] = useCreateTeamMutation();
    const [{}, updateTeam] = useUpdateTeamMutation();

    const [optionsUser] = useGetUsersSelectQuery({
        variables: {
            limit: 10,
            active: true,
        },
    });

    const handleTitle = (): string => {
        let title = "";
        switch (context) {
            case "create":
                title = "Create Team";
                break;
            case "update":
                title = "Update Team";
                break;
            case "view":
                title = "Team Details";
                break;
        }
        return title;
    };
    const handleChangeTeam = (e: ChangeEvent<HTMLInputElement>) => {
        setTeamInfo((prevTeam) => ({
            ...prevTeam,
            [e.target.name]: e.target.value,
        }));
    };

    const getIndexOfCurrentLeader = (): number => {
        let index = 0;
        let leader = optionsUser.data?.getUsersSelect?.filter((user) => {
            return user.value === teamInfo.leader_id;
        });
        if (leader) {
            index = optionsUser.data?.getUsersSelect?.indexOf(leader[0]);
        }
        return index;
    };

    const handleSetInfo = () => {
        if (!team) {
            setTeamInfo((prevInfo) => ({
                ...prevInfo,
                id: "",
                name: "",
                description: "",
                leader_id: "",
                members: [],
            }));
        } else {
            setTeamInfo((prevInfo) => ({
                ...prevInfo,
                id: team.id,
                name: team.name,
                description: team.description,
                leader_id: team.leader.id,
                members: team.members,
            }));
        }
    };

    useEffect(() => {
        if (optionsUser.fetching) return;
        handleSetInfo();
    }, [team, optionsUser.fetching]);

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
                            id: teamInfo.id,
                            leader_id: teamInfo.leader_id,
                            name: teamInfo.description,
                            description: teamInfo.description,
                        }}
                        enableReinitialize={true}
                        onSubmit={async (values) => {
                            setLoading(true);
                            if (context === "update") {
                                const response = await updateTeam({
                                    id: values.id,
                                    options: {
                                        name: values.name,
                                        description: values.description,
                                        leader_id: values.leader_id,
                                    },
                                });
                                if (response.data?.updateTeam?.errors) {
                                    let result = definedErrorMap(
                                        response.data?.updateTeam?.errors
                                    );
                                }
                            } else {
                            }
                        }}
                    >
                        {(props) => (
                            <Form {...props}>
                                <Stack spacing={3}>
                                    <Field name="name">
                                        {({ field }) => (
                                            <FormControl isInvalid={false}>
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
                                                    readOnly={
                                                        context === "view"
                                                    }
                                                    color={color[colorMode]}
                                                    onChange={handleChangeTeam}
                                                    value={teamInfo.name}
                                                />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="description">
                                        {({ field }) => (
                                            <FormControl isInvalid={false}>
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
                                                    readOnly={
                                                        context === "view"
                                                    }
                                                    color={color[colorMode]}
                                                    onChange={handleChangeTeam}
                                                    value={truncateString(
                                                        teamInfo.description,
                                                        50
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="leader_id">
                                        {({ field }) => (
                                            <FormControl>
                                                <FormLabel htmlFor="leader_id">
                                                    <Text
                                                        color={color[colorMode]}
                                                    >
                                                        Leader
                                                    </Text>
                                                </FormLabel>
                                                <Select
                                                    isDisabled={
                                                        context === "view"
                                                    }
                                                    defaultValue={
                                                        optionsUser?.data
                                                            ?.getUsersSelect[
                                                            getIndexOfCurrentLeader()
                                                        ]
                                                    }
                                                    options={
                                                        optionsUser?.data
                                                            ?.getUsersSelect
                                                    }
                                                />
                                                <FormErrorMessage></FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Flex justifyContent="flex-end">
                                        <Button
                                            isDisabled={context === "create"}
                                            size="xs"
                                            onClick={handleShowMembers.onToggle}
                                        >
                                            {" "}
                                            <Text color={color[colorMode]}>
                                                Show Members
                                            </Text>
                                        </Button>{" "}
                                    </Flex>

                                    {context !== "view" ? (
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
                                    ) : (
                                        <></>
                                    )}
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
                handleShowMembers.onClose();
                handleSetInfo();
            }}
            scrollBehavior={"inside"}
            size={"2xl"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex>
                        <Text color={color[colorMode]}>{handleTitle()}</Text>
                    </Flex>
                </ModalHeader>
                {loading ? <FlexSpinner /> : content}
                <ModalFooter>
                    <ModalBody>
                        <Flex mb={2}>
                            <Collapse in={handleShowMembers.isOpen}>
                                {context !== "create" ? (
                                    <Flex>
                                        {team &&
                                            team.members &&
                                            team.members.map((member) => (
                                                <Tooltip
                                                    hasArrow
                                                    aria-label={member.name}
                                                    label={member.name}
                                                    colorScheme="withe"
                                                    key={member.id}
                                                >
                                                    <Image
                                                        m={1}
                                                        boxSize="40px"
                                                        borderRadius="full"
                                                        src={getServerPathImage(
                                                            member.picture
                                                        )}
                                                    />
                                                </Tooltip>
                                            ))}
                                    </Flex>
                                ) : (
                                    <></>
                                )}
                            </Collapse>
                        </Flex>
                    </ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalCreateUpdateViewTeams;
