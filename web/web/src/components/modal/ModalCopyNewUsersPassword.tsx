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
    Button,
} from "@chakra-ui/react";
import { useState } from "react";

interface ModalCopyNewUsersPasswordProps {
    onClose: () => void;
    isOpen: boolean;
    password: string;
    textColor: string;
}

const ModalCopyNewUsersPassword: React.FC<ModalCopyNewUsersPasswordProps> = ({
    isOpen,
    onClose,
    password,
    textColor,
}) => {
    const [passwordCopied, setPasswordCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(password);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"inside"}
            size={"lg"}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex>
                        <Text textColor="teal">User Created Successfully</Text>
                    </Flex>
                </ModalHeader>
                {passwordCopied && (
                    <ModalCloseButton
                        color={textColor}
                        onClick={() => {
                            setPasswordCopied(false);
                        }}
                    />
                )}
                <ModalBody>
                    <Flex flexDir="column">
                        <Text textColor={textColor}>
                            Please Copy the new user's password and repasse to
                            him, the password will be send to email soon, but
                            now, must be copied here before, also the user can
                            change the password on settings page.
                        </Text>
                        <Flex justifyContent="center" flexDir="column">
                            <Flex justifyContent="center" p={2} m={3}>
                                <Text fontWeight="bold" textColor={textColor}>
                                    {password}
                                </Text>
                            </Flex>
                            <Button
                                onClick={() => {
                                    copy();
                                    setPasswordCopied(true);
                                }}
                                variant={passwordCopied ? "cyan-gradient" : ""}
                            >
                                <Text textColor={textColor}>
                                    {passwordCopied
                                        ? "Copied!"
                                        : "Click to copy"}
                                </Text>
                            </Button>
                        </Flex>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalCopyNewUsersPassword;
