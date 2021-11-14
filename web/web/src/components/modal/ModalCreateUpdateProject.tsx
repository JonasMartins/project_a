import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useColorMode,
    Flex,
    useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import FlexSpinner from "../rootComponents/FlexSpinner";

interface ModalCreateUpdateProjectProps {
    onClose: () => void;
    isOpen: boolean;
    context: "update" | "create";
}

const ModalCreateUpdateProject: React.FC<ModalCreateUpdateProjectProps> = ({
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
            <ModalBody></ModalBody>
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
                                ? "Create Project"
                                : "Update Project"}
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

export default ModalCreateUpdateProject;
