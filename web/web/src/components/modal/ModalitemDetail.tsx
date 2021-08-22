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
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import {
    returnHeaderGradient,
    returnIconHeaderLabel,
    returnPriorityIconHeaderModal,
} from "./../../helpers/items/ItemFunctinHelpers";
import { GlobalContext } from "./../../context/globalContext";
import { useEffect } from "react";

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
    const { colorMode } = useContext(GlobalContext);
    const [color, setColor] = useState<"white" | "black" | null>(null);

    useEffect(() => {
        setColor(colorMode == "light" ? "white" : "black");
    }, [colorMode]);

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
                            <Text color={color} fontSize="lg">
                                Summary:
                            </Text>
                            {returnPriorityIconHeaderModal(priority)}
                        </Flex>
                        <Text color={color}>{summary}</Text>

                        <Text mt={3} color={color}>
                            Description:
                        </Text>
                        <Text color={color}>{description}</Text>
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
