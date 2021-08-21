import { Box, Text, Link, Flex /*Circle*/ } from "@chakra-ui/react";
import React, { useContext } from "react";
import { GlobalContext } from "./../context/globalContext";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import { useGetUserByIdQuery } from "./../generated/graphql";
import { FcDocument } from "react-icons/fc";
import NextLink from "next/link";
import Notifications from "./../components/layout/Notifications";
import ItensHome from "./../components/layout/ItensHome";

interface HomeNotificationsProps {}

const HomeNotifications: React.FC<HomeNotificationsProps> = ({}) => {
    const { userId } = useContext(GlobalContext);

    const [{ data, fetching, error }] = useGetUserByIdQuery({
        variables: {
            id: userId,
        },
        // context: useMemo(() => data, []),
        pause: true,
    });

    // useEffect(() => {
    //     if (fetching) return;

    //     // Set up to refetch in one second, if the query is idle
    //     const timerId = setTimeout(() => {
    //         reexecuteQuery({ requestPolicy: "cache-only" });
    //     }, 1000);

    //     return () => clearTimeout(timerId);
    // }, [fetching, reexecuteQuery]);

    if (error) return <p>Oh no... {error.message}</p>;

    const spinner = <FullPageSpinner />;
    const content = (
        <Flex boxShadow="xl" p="6" m={3} grow={1} flexDir="column">
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
            <Flex justifyContent="flex-start" alignItems="stretch">
                <Flex boxShadow="xl" rounded="md" p="2" flexDir="column">
                    {/* <Text fontSize="l">Your Work</Text> */}
                    <Flex p="1" alignItems="center">
                        <FcDocument size="2em" />
                        <NextLink href="#">
                            <Link fontSize="m" m="2">
                                Project Name
                            </Link>
                        </NextLink>
                    </Flex>
                </Flex>
                <Flex
                    boxShadow="xl"
                    p="2"
                    m="2"
                    rounded="md"
                    flexDir="column"
                    flexGrow={1}
                >
                    <Flex flexDir="row" alignItems="center">
                        {/* <Circle m="1" size="1.5em" bg="red.500">
                            <Text color="white">99</Text>
                        </Circle> */}
                        <Text fontSize="l" ml="1">
                            Notifications
                        </Text>
                    </Flex>
                    <Notifications />
                </Flex>
            </Flex>
            <Box mt="3">
                <ItensHome userId={userId} />
            </Box>
        </Flex>
    );
    return fetching ? spinner : content;
};

export default HomeNotifications;
