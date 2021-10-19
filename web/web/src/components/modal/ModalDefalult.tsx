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
} from "@chakra-ui/react";

interface ModalManagerUpdateUserProps {
    onClose: () => void;
    isOpen: boolean;
}

const ModalManagerUpdateUser: React.FC<ModalManagerUpdateUserProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"inside"}
            size={"4xl"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex>
                        <Text>Title</Text>
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
