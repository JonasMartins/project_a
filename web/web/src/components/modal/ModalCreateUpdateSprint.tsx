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
import React, { useEffect, useState } from "react";
import FlexSpinner from "../rootComponents/FlexSpinner";
import {
    projectSprintType,
    sprintType,
    customSprintErrors,
} from "./../../utils/generalGroupTypes";

interface sprintInfo {
    id: string;
    code: string;
    project: projectSprintType;
    end: Date;
    length: string;
    active: boolean;
}

interface ModalCreateUpdateSprintProps {
    onClose: () => void;
    isOpen: boolean;
    context: "update" | "create";
    sprint: sprintType | null;
    countUpdate: number;
    updateCallback: (number) => void;
}

const ModalCreateUpdateSprint: React.FC<ModalCreateUpdateSprintProps> = ({
    isOpen,
    onClose,
    context,
    sprint,
    updateCallback,
    countUpdate,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [hasSubmit, setHasSubmit] = useState(0);

    const [sprintInfo, setSprintInfo] = useState<sprintInfo>({
        id: sprint?.sprint?.id,
        code: sprint?.sprint?.code,
        project: sprint?.sprint?.project,
        end: sprint?.sprint?.final,
        length: sprint?.sprint?.length,
        active: sprint?.sprint?.active,
    });

    const [customErrors, setCustonErrors] = useState<customSprintErrors>({
        code: "",
        project: "",
    });

    useEffect(() => {
        if (!sprint) {
            setSprintInfo((prevSprint) => ({
                ...prevSprint,
                id: "",
                code: "",
                project: null,
                end: null,
                length: "",
                active: false,
            }));
        } else {
            setSprintInfo((prevSprint) => ({
                ...prevSprint,
                id: sprint?.sprint?.id,
                code: sprint?.sprint?.code,
                project: sprint?.sprint?.project,
                end: sprint?.sprint?.final,
                length: sprint?.sprint?.length,
                active: sprint?.sprint?.active,
            }));
        }
    }, [sprint]);

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
