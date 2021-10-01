import {
    Flex,
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
    Image,
    Tooltip,
} from "@chakra-ui/react";
import React from "react";

interface ModalAboutProjectProps {
    onClose: () => void;
    isOpen: boolean;
}

const ModalAboutProject: React.FC<ModalAboutProjectProps> = ({
    isOpen,
    onClose,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"5xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Text size="3xl" color={color[colorMode]}>
                        About This project
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Divider mt={2} mb={2} />
                    <Flex flexDir="column">
                        <Text fontSize="xl" mb={2} color={color[colorMode]}>
                            Technologies
                        </Text>
                        <Flex flexDir="row" justifyContent="space-around">
                            <Tooltip
                                hasArrow
                                aria-label="graphql"
                                label="GrapQL"
                            >
                                <Image
                                    boxSize="50px"
                                    src="/images/about_images/graphql-logo-2.png"
                                />
                            </Tooltip>
                            <Tooltip
                                hasArrow
                                aria-label="react"
                                label="React js"
                            >
                                <Image
                                    boxSize="50px"
                                    src="/images/about_images/react.png"
                                />
                            </Tooltip>
                            <Tooltip
                                hasArrow
                                aria-label="nextjs"
                                label="Next js"
                            >
                                <Image
                                    boxSize="50px"
                                    src="/images/about_images/next.jpeg"
                                />
                            </Tooltip>
                            <Tooltip
                                hasArrow
                                aria-label="postgres"
                                label="Postgres sql"
                            >
                                <Image
                                    boxSize="50px"
                                    src="/images/about_images/postgres.png"
                                />
                            </Tooltip>
                            <Tooltip
                                hasArrow
                                aria-label="nodejs"
                                label="Node js"
                            >
                                <Image
                                    boxSize="50px"
                                    src="/images/about_images/node.png"
                                />
                            </Tooltip>
                            <Tooltip
                                hasArrow
                                aria-label="chakraUI"
                                label="Chakra UI"
                            >
                                <Image
                                    borderRadius="full"
                                    boxSize="50px"
                                    src="/images/about_images/chakra.png"
                                />
                            </Tooltip>
                            <Tooltip hasArrow aria-label="urql" label="URQL">
                                <Image
                                    borderRadius="full"
                                    boxSize="50px"
                                    src="/images/about_images/urql.png"
                                />
                            </Tooltip>
                        </Flex>
                        <Divider mt={2} mb={2} />
                        <Text fontSize="md" mt="2" color={color[colorMode]}>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Incidunt reprehenderit laboriosam perspiciatis
                            sapiente error facilis, at rem quam cum, nesciunt
                            repellat illo, non dolorum blanditiis expedita in.
                            Assumenda, quibusdam nobis.
                        </Text>
                        <Text fontSize="md" mt="2" color={color[colorMode]}>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ratione quae explicabo ex magni quisquam
                            dolorum! Quasi, debitis hic facilis ea itaque magni
                            modi obcaecati in blanditiis illo, laborum alias.
                            Animi.
                        </Text>
                        <Text fontSize="md" mt="2" color={color[colorMode]}>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Molestias quo est dolore eaque sit
                            consectetur. Veritatis vel obcaecati asperiores ad
                            voluptatem alias! At illum praesentium, eaque
                            facilis esse natus omnis.
                        </Text>
                    </Flex>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalAboutProject;
