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
    userSelectOption,
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
    countUpdate: number;
    updateCallback: (number) => void;
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
    updateCallback,
    countUpdate,
}) => {
    const toast = useToast();
    const { colorMode } = useColorMode();
    const [loading, setLoading] = useState(false);
    const [teamMembersIds, setTeamMembersIds] = useState<string[]>([]);
    const color = { light: "black", dark: "white" };

    let teamMembers: Array<userSelectOption> = [];

    const handleShowOptions = useDisclosure();
    const handleShowMembers = useDisclosure();

    const [teamInfo, setTeamInfo] = useState<teamInfoType>({
        id: team?.id,
        name: team?.name,
        description: team?.description,
        leader_id: team?.leader.id,
        members: team?.members,
    });

    const [customErrors, setCustonErrors] = useState<customTeamErrors>({
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
        setCustonErrors((prevErrors) => ({
            ...prevErrors,
            id: "",
            leader_id: "",
            name: "",
            description: "",
        }));
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

    const getCurrentTeamMemebers = (): Array<userSelectOption> => {
        if (!teamMembers.length) {
            optionsUser.data?.getUsersSelect?.forEach((user) => {
                let alreadyMember = team?.members?.find((member) => {
                    return member.id === user.value;
                });

                if (alreadyMember) {
                    teamMembers.push({
                        value: alreadyMember.id,
                        label: alreadyMember.name,
                    });
                }
            });
        }
        return teamMembers;
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
            if (team.members) {
                team.members.map((member) =>
                    setTeamMembersIds((prevIds) => [...prevIds, member.id])
                );
            }
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
                            name: teamInfo.name,
                            description: teamInfo.description,
                            members: teamMembersIds,
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
                                    members: values.members,
                                });
                                if (response.data?.updateTeam?.errors) {
                                    let result = definedErrorMap(
                                        response.data?.updateTeam?.errors
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
                                        setTimeout(() => {
                                            updateCallback(countUpdate + 1);
                                            toast({
                                                title: "Team Updated",
                                                description:
                                                    "Team successfully updated",
                                                status: "success",
                                                duration: 8000,
                                                isClosable: true,
                                                position: "bottom-right",
                                            });
                                            setLoading(false);
                                            onClose();
                                        }, 500);
                                    });
                                }
                            } else {
                                const response = await createTeam({
                                    options: {
                                        name: values.name,
                                        description: values.description,
                                        leader_id: values.leader_id,
                                    },
                                    members: values.members,
                                });

                                if (response.data?.createTeam?.errors) {
                                    let result = definedErrorMap(
                                        response.data?.createTeam?.errors
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
                                        setTimeout(() => {
                                            updateCallback(countUpdate + 1);
                                            toast({
                                                title: "Team Created",
                                                description:
                                                    "Team successfully created",
                                                status: "success",
                                                duration: 8000,
                                                isClosable: true,
                                                position: "bottom-right",
                                            });
                                            setLoading(false);
                                            onClose();
                                        }, 500);
                                    });
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
                                                <FormErrorMessage>
                                                    {customErrors.description}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="leader_id">
                                        {({}) => (
                                            <FormControl>
                                                <FormLabel htmlFor="leader_id">
                                                    <Text
                                                        color={color[colorMode]}
                                                    >
                                                        Leader
                                                    </Text>
                                                </FormLabel>
                                                <Select
                                                    aria-label="select leader"
                                                    placeholder="Search user"
                                                    isDisabled={
                                                        context === "view"
                                                    }
                                                    onMenuOpen={
                                                        handleShowOptions.onOpen
                                                    }
                                                    onMenuClose={
                                                        handleShowOptions.onClose
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
                                                    onChange={(e) => {
                                                        setTeamInfo(
                                                            (prevTeam) => ({
                                                                ...prevTeam,
                                                                leader_id:
                                                                    e.value,
                                                            })
                                                        );
                                                    }}
                                                />
                                                <FormErrorMessage></FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Collapse
                                        in={handleShowOptions.isOpen}
                                        animateOpacity
                                    >
                                        <Flex minHeight="10em" mt={2} />
                                    </Collapse>
                                    <Field name="members">
                                        {({}) => (
                                            <FormControl>
                                                <FormLabel htmlFor="members">
                                                    <Text
                                                        color={color[colorMode]}
                                                    >
                                                        Members
                                                    </Text>
                                                </FormLabel>
                                                <Select
                                                    aria-label="select members"
                                                    isDisabled={
                                                        context === "view"
                                                    }
                                                    onMenuOpen={
                                                        handleShowMembers.onOpen
                                                    }
                                                    onMenuClose={
                                                        handleShowMembers.onClose
                                                    }
                                                    isMulti
                                                    options={
                                                        optionsUser?.data
                                                            ?.getUsersSelect
                                                    }
                                                    defaultValue={getCurrentTeamMemebers()}
                                                    onChange={(e) => {
                                                        setTeamMembersIds([]);
                                                        e.map((option) =>
                                                            setTeamMembersIds(
                                                                (prevIds) => [
                                                                    ...prevIds,
                                                                    option.value,
                                                                ]
                                                            )
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Collapse
                                        in={handleShowMembers.isOpen}
                                        animateOpacity
                                    >
                                        <Flex minHeight="10em" mt={2} />
                                    </Collapse>
                                    {context !== "view" ? (
                                        <Button
                                            isLoading={props.isSubmitting}
                                            type="submit"
                                            variant="cyan-gradient"
                                            borderRadius="2em"
                                            size="md"
                                            flexFlow="row"
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
                handleSetInfo();
                teamMembers = [];
                setTeamMembersIds([]);
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
                        <Flex justifyContent="center">
                            <Text
                                fontWeight="semibold"
                                color={color[colorMode]}
                                mb={3}
                            >
                                Current Members:
                            </Text>{" "}
                        </Flex>
                        <Flex mb={2}>
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
                        </Flex>
                    </ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalCreateUpdateViewTeams;
