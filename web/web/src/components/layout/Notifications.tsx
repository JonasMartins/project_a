import React, { useEffect, useCallback, useState } from "react";
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
    Circle,
    useDisclosure,
    useColorMode,
} from "@chakra-ui/react";
import {
    useGetNewsRelatedToUserQuery,
    useAddUsersWhoSawTheNewsMutation,
} from "./../../generated/graphql";
import FlexSpinner from "./../rootComponents/FlexSpinner";
import { useUser } from "./../../helpers/hooks/useUser";
import { AiOutlineEye } from "react-icons/ai";
import { BellIcon } from "@chakra-ui/icons";
import { truncateString } from "../../helpers/generalUtilitiesFunctions";
import ModalSeeNotificaion from "./../../components/modal/ModalSeeNotification";
import { newsRelatedToUserType } from "./../../utils/generalGroupTypes";

interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = ({}) => {
    const user = useUser();

    const { colorMode } = useColorMode();
    const bgColorDarker = { light: "gray.200", dark: "gray.800" };
    const bgColor = { light: "gray.50", dark: "gray.700" };
    const bellColor = { light: "white", dark: "black" };

    const [selectedNews, setSelectedNews] =
        useState<newsRelatedToUserType>(null);

    const modalSeeNotification = useDisclosure();

    const customOpenModal = () => {
        modalSeeNotification.onOpen();
    };

    const [news, reexecuteQuery] = useGetNewsRelatedToUserQuery({
        variables: {
            limit: 10,
            userId: user.userId,
        },
        pause: !user || !user.userId,
    });

    const [countUpdate, setCountUpdate] = useState(0);
    const updatedCallback = (value: number): void => {
        setCountUpdate(value);
    };

    const [resultAddNotificationHasBeenSeen, addUserAlreadySawThisNews] =
        useAddUsersWhoSawTheNewsMutation();

    const addNotificationHasBeenSeen = async (
        _news: newsRelatedToUserType
    ): Promise<void> => {
        if (!_news.usersSeen.includes(user.userId)) {
            await addUserAlreadySawThisNews({
                userId: user.userId,
                newsId: _news.id,
            });
        }
    };

    const checkIfNotificationHasBeenSeen = (
        _news: newsRelatedToUserType
    ): boolean => {
        return _news.usersSeen.includes(user.userId);
    };

    const refreshNotifications = useCallback(() => {
        reexecuteQuery({
            requestPolicy: "network-only",
        });
    }, []);

    useEffect(() => {
        if (news.fetching) return;
    }, [news.fetching, user.userId, resultAddNotificationHasBeenSeen.fetching]);

    useEffect(() => {
        refreshNotifications();
    }, [countUpdate]);

    const content = (
        <React.Fragment>
            <Table size="sm">
                <Thead>
                    <Tr>
                        <Th></Th>
                        <Th>Description</Th>
                        <Th>Details</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {news.data?.getNewsRelatedToUser?.news ? (
                        news.data.getNewsRelatedToUser.news.map(
                            (notification) => (
                                <Tr
                                    key={notification.id}
                                    bg={
                                        checkIfNotificationHasBeenSeen(
                                            notification
                                        )
                                            ? bgColorDarker[colorMode]
                                            : bgColor[colorMode]
                                    }
                                >
                                    <Td>
                                        <Circle
                                            w="25px"
                                            h="25px"
                                            bg={
                                                checkIfNotificationHasBeenSeen(
                                                    notification
                                                )
                                                    ? "grey.200"
                                                    : "red.500"
                                            }
                                            color={bellColor[colorMode]}
                                        >
                                            <BellIcon />
                                        </Circle>
                                    </Td>
                                    <Td>
                                        {truncateString(
                                            notification.description,
                                            50
                                        )}
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
                                                onClick={() => {
                                                    customOpenModal();
                                                    setSelectedNews(
                                                        notification
                                                    );
                                                    addNotificationHasBeenSeen(
                                                        notification
                                                    );
                                                }}
                                            />
                                        </Tooltip>
                                    </Td>
                                </Tr>
                            )
                        )
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
            <ModalSeeNotificaion
                isOpen={modalSeeNotification.isOpen}
                onClose={modalSeeNotification.onClose}
                news={selectedNews}
                countUpdate={countUpdate}
                updateCallback={updatedCallback}
            />
        </React.Fragment>
    );

    return news.fetching ? <FlexSpinner /> : content;
};

export default Notifications;
