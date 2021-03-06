import { Box, Text, Flex } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { GlobalContext } from "./../context/globalContext";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import { useGetUserByIdQuery } from "./../generated/graphql";
import Notifications from "./../components/layout/Notifications";
import ItensHome from "./../components/layout/ItensHome";
import { useUser } from "./../helpers/hooks/useUser";

interface HomeNotificationsProps {}

const HomeNotifications: React.FC<HomeNotificationsProps> = ({}) => {
    const { setCurrentUserName } = useContext(GlobalContext);

    const user = useUser();

    const [{ data, fetching, error }, reexecuteQuery] = useGetUserByIdQuery({
        variables: {
            id: user.userId,
        },
        pause: true,
    });

    useEffect(() => {
        if (fetching) return;

        if (data?.getUserById?.user) {
            setCurrentUserName(data.getUserById.user.name);
        }

        reexecuteQuery({ requestPolicy: "cache-and-network" });
    }, [fetching, reexecuteQuery]);

    if (error) return <p>Oh no... {error.message}</p>;

    const spinner = <FullPageSpinner />;
    const content = (
        <Flex boxShadow="xl" p="6" m={1} grow={1} flexDir="column">
            <Box>
                <Flex alignItems="baseline">
                    <Text fontSize="xl" m="1">
                        Welcome {data ? data.getUserById?.user?.name : ""}
                    </Text>
                    <Text fontSize="xs" m="1">
                        {data ? data.getUserById?.user?.email : null}
                    </Text>
                </Flex>
            </Box>
            <Flex>
                <Flex
                    boxShadow="xl"
                    p="2"
                    m="2"
                    rounded="md"
                    flexDir="column"
                    flexGrow={1}
                >
                    <Flex flexDir="row" alignItems="center">
                        <Text fontSize="l" ml="1">
                            Notifications
                        </Text>
                    </Flex>
                    <Notifications />
                </Flex>
            </Flex>
            <Box mt="3">
                <ItensHome userId={user.userId} />
            </Box>
        </Flex>
    );
    return fetching ? spinner : content;
};

export default HomeNotifications;
