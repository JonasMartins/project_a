import React from "react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Box,
} from "@chakra-ui/react";

interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = ({}) => {
    return (
        <Box>
            <Table variant="striped">
                <TableCaption>Notifications</TableCaption>
                <Thead>
                    <Tr>
                        <Th>To convert</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>inches</Td>
                    </Tr>
                    <Tr>
                        <Td>feet</Td>
                    </Tr>
                    <Tr>
                        <Td>yards</Td>
                    </Tr>
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>To convert</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </Box>
    );
};

export default Notifications;
