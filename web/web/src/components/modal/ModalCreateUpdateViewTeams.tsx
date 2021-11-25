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
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import FlexSpinner from "./../rootComponents/FlexSpinner";
import {
    teamGetTeamsType,
    membersGetTeamsType,
} from "./../../utils/generalGroupTypes";
import { useGetAllUsersQuery } from "./../../generated/graphql";
import { Field, Form, Formik } from "formik";
import { getServerPathImage } from "../../utils/handleServerImagePaths";

interface ModalCreateUpdateViewTeamsProps {
    onClose: () => void;
    isOpen: boolean;
    context: "update" | "create" | "view";
    team: teamGetTeamsType | null;
}

interface teamMember {
    id: string;
    name: string;
    role: string;
    member: string;
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

    const [teamInfo, setTeamInfo] = useState<teamInfoType>(null);

    const [usersQuery] = useGetAllUsersQuery({
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

    useEffect(() => {
        if (usersQuery.fetching) return;

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
    }, [team, usersQuery.fetching]);

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
                        initialValues={{}}
                        enableReinitialize={true}
                        onSubmit={() => {}}
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
                                                    value={teamInfo.description}
                                                />
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
                                        {teamInfo &&
                                            teamInfo.members.map((member) => (
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
