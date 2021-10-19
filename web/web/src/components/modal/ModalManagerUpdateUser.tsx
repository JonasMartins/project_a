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

interface ModalManagerUpdateUserProps {
    onClose: () => void;
    isOpen: boolean;
}

const ModalManagerUpdateUser: React.FC<ModalManagerUpdateUserProps> = ({
    isOpen,
    onClose,
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
                        <Text color={color[colorMode]}>User</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody></ModalBody>
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalManagerUpdateUser;
