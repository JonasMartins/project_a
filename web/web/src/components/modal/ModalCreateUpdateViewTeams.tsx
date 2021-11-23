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
} from "@chakra-ui/react";
import React, { useState } from "react";
import FlexSpinner from "./../rootComponents/FlexSpinner";
import { teamGetTeamsType } from "./../../utils/generalGroupTypes";
import { useGetAllUsersQuery } from "./../../generated/graphql";

interface ModalCreateUpdateViewTeamsProps {
    onClose: () => void;
    isOpen: boolean;
    context: "update" | "create" | "view";
    team: teamGetTeamsType | null;
}

const ModalCreateUpdateViewTeams: React.FC<ModalCreateUpdateViewTeamsProps> = ({
    isOpen,
    onClose,
    context,
    team,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };
    const toast = useToast();
    const [loading, setLoading] = useState(false);

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

    const content = (
        <React.Fragment>
            <ModalCloseButton color={color[colorMode]} />
            <ModalBody></ModalBody>
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
                        <Text color={color[colorMode]}>{handleTitle()}</Text>
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

export default ModalCreateUpdateViewTeams;
