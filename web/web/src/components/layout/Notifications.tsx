import React, { useEffect, useCallback } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    IconButton,
    Tooltip,
} from "@chakra-ui/react";
import { useGetNewsRelatedToUserQuery } from "./../../generated/graphql";
import FlexSpinner from "./../rootComponents/FlexSpinner";
import { useUser } from "./../../helpers/hooks/useUser";
import { AiOutlineEye } from "react-icons/ai";
import { BellIcon } from "@chakra-ui/icons";
import { truncateString } from "../../helpers/generalUtilitiesFunctions";

interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = ({}) => {
    const user = useUser();

    const [news, reexecuteQuery] = useGetNewsRelatedToUserQuery({
        variables: {
            limit: 10,
            userId: user.userId,
        },
        pause: !user || !user.userId,
    });

    const refreshNotifications = useCallback(() => {
        console.log("refresh ?");
        reexecuteQuery({
            requestPolicy: "network-only",
        });
    }, []);

    useEffect(() => {
        if (news.fetching) return;
    }, [news.fetching, user.userId]);

    useEffect(() => {
        refreshNotifications();
    }, []);

    const content = (
        <Table variant="striped" size="sm">
            <Thead>
                <Tr>
                    <Th></Th>
                    <Th>Description</Th>
                    <Th>Details</Th>
                </Tr>
            </Thead>
            <Tbody>
                {news.data?.getNewsRelatedToUser?.news ? (
                    news.data.getNewsRelatedToUser.news.map((notification) => (
                        <Tr key={notification.id}>
                            <Td>
                                <BellIcon />
                            </Td>
                            <Td>
                                {truncateString(notification.description, 50)}
                            </Td>
                            <Td>
                                <Tooltip
                                    hasArrow
                                    aria-label="See Notification"
                                    label="See Notification"
                                    colorScheme="withe"
                                >
                                    <IconButton
                                        isRound={true}
                                        aria-label="Notification Details"
                                        icon={<AiOutlineEye />}
                                    />
                                </Tooltip>
                            </Td>
                        </Tr>
                    ))
                ) : (
                    <Tr>
                        <Td>...</Td>
                        <Td></Td>
                        <Td></Td>
                    </Tr>
                )}
            </Tbody>
            <Tfoot></Tfoot>
        </Table>
    );

    return news.fetching ? <FlexSpinner /> : content;
};

export default Notifications;
