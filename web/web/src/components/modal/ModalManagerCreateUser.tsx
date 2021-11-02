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
} from "@chakra-ui/react";
import React from "react";
import { GetAllRolesQuery } from "./../../generated/graphql";
import CreateUserForm from "./../form/CreateUser.form";

interface ModalManagerCreateUserProps {
    onClose: () => void;
    isOpen: boolean;
    roles: GetAllRolesQuery | null;
}

const ModalManagerCreateUser: React.FC<ModalManagerCreateUserProps> = ({
    isOpen,
    onClose,
    roles,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };

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
                    <CreateUserForm textColor={color[colorMode]} />
                </ModalBody>
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalManagerCreateUser;
