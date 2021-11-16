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
    useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import FlexSpinner from "../rootComponents/FlexSpinner";

interface ModalCreateUpdateSprintProps {
    onClose: () => void;
    isOpen: boolean;
    context: "update" | "create";
}

const ModalCreateUpdateSprint: React.FC<ModalCreateUpdateSprintProps> = ({
    isOpen,
    onClose,
    context,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [hasSubmit, setHasSubmit] = useState(0);

    const content = (
        <React.Fragment>
            <ModalCloseButton color={color[colorMode]} />
            <ModalBody>
                <Flex p={2} m={2} justifyContent="center"></Flex>
            </ModalBody>
        </React.Fragment>
    );

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
                        <Text color={color[colorMode]}>
                            {context === "create"
                                ? "Create Sprint"
                                : "Update Sprint"}
                        </Text>
                    </Flex>
                </ModalHeader>

                {loading ? <FlexSpinner /> : content}
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalCreateUpdateSprint;
