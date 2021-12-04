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
    itemRelatedToUser,
} from "./../../helpers/items/ItemFunctinHelpers";
interface ModalitemDetailProps {
    isOpen: boolean;
    onClose: () => void;
    item: itemRelatedToUser | null;
}

const ModalitemDetail: React.FC<ModalitemDetailProps> = ({
    isOpen,
    onClose,
    item,
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
                <ModalHeader bgGradient={returnHeaderGradient(item?.type)}>
                    <Flex flexDirection="row" alignItems="center">
                        <Text textColor="white">Task Preview</Text>
                        {returnIconHeaderLabel(item?.type)}
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
                            {returnPriorityIconHeaderModal(item?.priority)}
                        </Flex>
                        <Text color={color[colorMode]}>{item?.summary}</Text>

                        <Text mt={3} color={color[colorMode]}>
                            Description:
                        </Text>
                        <Text color={color[colorMode]}>
                            {item?.description}
                        </Text>
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
