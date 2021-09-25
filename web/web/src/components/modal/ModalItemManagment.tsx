import React from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useColorMode,
} from "@chakra-ui/react";

interface ModalItemManagmentProps {
    onClose: () => void;
    isOpen: boolean;
    hasChangedStatus?: (value: boolean) => void;
}

const ModalItemManagment: React.FC<ModalItemManagmentProps> = ({
    isOpen,
    onClose,
    hasChangedStatus,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"inside"}
            size={"xl"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Text color={color[colorMode]}>Title</Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text color={color[colorMode]}>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Earum sit maiores accusantium repudiandae modi
                        aperiam, quasi voluptas? Placeat aliquam vel eligendi
                        adipisci odio. Sunt labore numquam, recusandae
                        praesentium nisi unde?
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={onClose} variant="ghost">
                        Close
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => hasChangedStatus(true)}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalItemManagment;
