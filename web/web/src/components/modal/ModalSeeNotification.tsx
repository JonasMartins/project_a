import { BellIcon } from "@chakra-ui/icons";
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
    Circle,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import { newsRelatedToUserType } from "./../../utils/generalGroupTypes";

interface ModalSeeNotificaionProps {
    onClose: () => void;
    isOpen: boolean;
    news: newsRelatedToUserType | null;
    countUpdate: number;
    updateCallback: (number) => void;
}

const ModalSeeNotificaion: React.FC<ModalSeeNotificaionProps> = ({
    isOpen,
    onClose,
    news,
    countUpdate,
    updateCallback,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };

    useEffect(() => {}, [news]);

    const content = (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                updateCallback(countUpdate + 1);
                onClose();
            }}
            scrollBehavior={"inside"}
            size={"lg"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex>
                        <Circle w="40px" h="40px" bg="blue.500" color="white">
                            <AiFillInfoCircle />
                        </Circle>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton color={color[colorMode]} />
                <ModalBody>
                    <Text mt={2} color={color[colorMode]}>
                        {news && news.description}
                    </Text>
                    <Text mt={2} color={color[colorMode]}>
                        {news && news.pathInfo}
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

    return news ? content : <></>;
};

export default ModalSeeNotificaion;
