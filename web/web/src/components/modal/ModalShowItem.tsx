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
    Button,
} from "@chakra-ui/react";
import React from "react";
import FlexSpinner from "../rootComponents/FlexSpinner";
import {
    itemQuery,
    returnHeaderGradient,
    returnIconHeaderLabel,
    returnPriorityIconHeaderModal,
} from "./../../helpers/items/ItemFunctinHelpers";

interface ModalShowItemProps {
    onClose: () => void;
    isOpen: boolean;
    item: itemQuery | null;
}

const ModalShowItem: React.FC<ModalShowItemProps> = ({
    isOpen,
    onClose,
    item,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };

    const content = (
        <ModalContent>
            <ModalHeader bgGradient={returnHeaderGradient(item.type)}>
                <Flex flexDirection="row" alignItems="center">
                    <Text textColor="white">Task Preview</Text>
                    {returnIconHeaderLabel(item.type)}
                </Flex>
            </ModalHeader>
            <ModalCloseButton color={color[colorMode]} />
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
                        {returnPriorityIconHeaderModal(item.priority)}
                    </Flex>
                    <Text color={color[colorMode]}>{item.summary}</Text>

                    <Text mt={3} color={color[colorMode]}>
                        Description:
                    </Text>
                    <Text color={color[colorMode]}>{item.description}</Text>
                </Flex>
            </ModalBody>
            <ModalFooter>
                <ModalBody></ModalBody>
            </ModalFooter>
        </ModalContent>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"inside"}
            size={"3xl"}
        >
            <ModalOverlay />
            {item ? content : <FlexSpinner />}
        </Modal>
    );
};

export default ModalShowItem;
