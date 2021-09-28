import React, { useEffect } from "react";
import FlexSpinner from "./../rootComponents/FlexSpinner";
import { FcPlus } from "react-icons/fc";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { useGetAppointmentsByItemQuery } from "./../../generated/graphql";
import {
    Table,
    Thead,
    Tr,
    Th,
    Tooltip,
    IconButton,
    Tbody,
    Td,
    Tfoot,
} from "@chakra-ui/react";

interface ModalTableItemAppointmentsProps {
    itemId: string;
}

const ModalTableItemAppointments: React.FC<ModalTableItemAppointmentsProps> = ({
    itemId,
}) => {
    const [{ data, fetching }, reexecuteQuery] = useGetAppointmentsByItemQuery({
        variables: { limit: 10, itemId: itemId },
    });

    useEffect(() => {
        if (fetching) return;
        reexecuteQuery({ requestPolicy: "cache-first" });
    }, [fetching, reexecuteQuery]);

    const content = (
        <>
            <Table variant="striped" size="lg">
                <Thead>
                    <Tr>
                        <Th>User</Th>
                        <Th>Date</Th>
                        <Th>start</Th>
                        <Th>finish</Th>
                        <Th>time</Th>
                        <Th>
                            <Tooltip
                                hasArrow
                                aria-label="Add appointment"
                                label="Add Appointment"
                            >
                                <IconButton
                                    aria-label="Add Appointment"
                                    isRound={true}
                                    icon={<FcPlus />}
                                />
                            </Tooltip>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.getAppointmentsByItem?.appointments?.map(
                        (appointment) => {
                            <Tr key={appointment.id}>
                                <Td>{appointment.user.name} ff</Td>
                                <Td>{appointment.start} ff </Td>
                                <Td>{appointment.start} ff</Td>
                                <Td>{appointment.end} ff</Td>
                                <Td>
                                    {appointment.end
                                        ? appointment.end - appointment.start
                                        : ""}
                                </Td>
                                <Td>
                                    <Tooltip
                                        hasArrow
                                        aria-label="Delete appointment"
                                        label="Delete Appointment"
                                    >
                                        <IconButton
                                            aria-label="Delete Appointment"
                                            isRound={true}
                                            icon={
                                                <IoMdRemoveCircleOutline color="red" />
                                            }
                                        />
                                    </Tooltip>
                                </Td>
                            </Tr>;
                        }
                    )}
                </Tbody>
                <Tfoot></Tfoot>
            </Table>
        </>
    );
    return fetching ? <FlexSpinner /> : content;
};

export default ModalTableItemAppointments;
