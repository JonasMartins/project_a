import {
    Button,
    Flex,
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
import React from "react";
import {
    returnHeaderGradient,
    returnIconHeaderLabel,
    returnPriorityIconHeaderModal,
} from "./../../helpers/items/ItemFunctinHelpers";
interface ModalitemDetailProps {
    summary: string;
    description: string;
    isOpen: boolean;
    type: enumItemType | null;
    priority: enumItemPriority | null;
    onClose: () => void;
}

const ModalitemDetail: React.FC<ModalitemDetailProps> = ({
    isOpen,
    onClose,
    summary,
    description,
    type,
    priority,
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
                <ModalHeader bgGradient={returnHeaderGradient(type)}>
                    <Flex flexDirection="row" alignItems="center">
                        <Text textColor="white">Task Preview</Text>
                        {returnIconHeaderLabel(type)}
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex flexDirection="column">
                        <Flex
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Text color={color[colorMode]} fontSize="lg">
                                Summary:
                            </Text>
                            {returnPriorityIconHeaderModal(priority)}
                        </Flex>
                        <Text color={color[colorMode]}>{summary}</Text>

                        <Text mt={3} color={color[colorMode]}>
                            Description:
                        </Text>
                        <Text color={color[colorMode]}>{description}</Text>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={onClose} variant="ghost">
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalitemDetail;
