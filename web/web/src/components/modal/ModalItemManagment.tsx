import {
    Button,
    Divider,
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
import { Item } from "./../../generated/graphql";
import { truncateString } from "./../../helpers/generalUtilitiesFunctions";
import ModalTableItemAppointments from "./ModalTableItemAppointments";

type itemQuery = {
    __typename?: "Item";
} & Pick<
    Item,
    "id" | "description" | "summary" | "status" | "priority" | "type"
>;

interface ModalItemManagmentProps {
    onClose: () => void;
    isOpen: boolean;
    hasChangedStatus?: (value: boolean) => void;
    item: itemQuery;
}

const ModalItemManagment: React.FC<ModalItemManagmentProps> = ({
    isOpen,
    onClose,
    hasChangedStatus,
    item,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };

    // if (error) return <p>Oh no... {error.message}</p>;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"inside"}
            size={"4xl"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Text color={color[colorMode]}>
                        {item && truncateString(item.summary, 15)}
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text color={color[colorMode]}>
                        {item && item.description}
                    </Text>
                    <Divider mt={2} mb={2} />
                    <Text
                        fontSize="xl"
                        fontWeight="semibold"
                        color={color[colorMode]}
                    >
                        Appointments
                    </Text>
                    {isOpen ? (
                        <ModalTableItemAppointments itemId={item.id} />
                    ) : (
                        // SOLUÇÃO SERÁ UMA HOOK CUSTOMIZADA, CHAMANDO DE OUTRO ARQUIVO E
                        // TRAZENDO OS APONTAMENTOS AQUI E PASSANDO OS DADOS PARA O MODAL MAIS INTERNO
                        <></>
                    )}
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
