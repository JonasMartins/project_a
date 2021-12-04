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
    Image,
    Tooltip,
    useColorMode,
} from "@chakra-ui/react";
import React from "react";
import { getServerPathImage } from "../../utils/handleServerImagePaths";
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
                    {returnIconHeaderLabel(item?.type)}
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
                        {returnPriorityIconHeaderModal(item?.priority)}
                    </Flex>
                    <Text color={color[colorMode]}>{item?.summary}</Text>

                    <Text mt={3} color={color[colorMode]}>
                        Description:
                    </Text>
                    <Text color={color[colorMode]}>{item?.description}</Text>
                </Flex>
            </ModalBody>
            <ModalFooter>
                <ModalBody>
                    <Flex>
                        <Tooltip
                            hasArrow
                            aria-label="item's responsible"
                            label={`Responsible: ${item?.responsible.name}`}
                            colorScheme="withe"
                        >
                            <Image
                                borderRadius="full"
                                boxSize="45px"
                                src={getServerPathImage(
                                    item?.responsible.picture
                                )}
                            />
                        </Tooltip>
                        <Tooltip
                            hasArrow
                            aria-label="item's approver"
                            label={`Approver: ${item?.approver.name}`}
                            colorScheme="withe"
                        >
                            <Image
                                ml={4}
                                borderRadius="full"
                                boxSize="45px"
                                src={getServerPathImage(item.approver.picture)}
                            />
                        </Tooltip>
                        <Tooltip
                            hasArrow
                            aria-label="item's reporter"
                            label={`Reporter: ${item.reporter.name}`}
                            colorScheme="withe"
                        >
                            <Image
                                ml={4}
                                borderRadius="full"
                                boxSize="45px"
                                src={getServerPathImage(item.reporter.picture)}
                            />
                        </Tooltip>
                    </Flex>
                </ModalBody>
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
