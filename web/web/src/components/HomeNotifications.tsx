import { Box, Text, Link, Flex, Circle } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { GlobalContext } from "./../context/globalContext";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import { useGetUserByIdQuery } from "./../generated/graphql";
import { FcDocument } from "react-icons/fc";
import NextLink from "next/link";
import Notifications from "./../components/layout/Notifications";

interface HomeNotificationsProps {}

const HomeNotifications: React.FC<HomeNotificationsProps> = ({}) => {
    const { userId, loading, setIsLoading } = useContext(GlobalContext);

    const [{ data }] = useGetUserByIdQuery({
        variables: {
            id: userId,
        },
    });

    useEffect(() => {
        if (userId) {
            setIsLoading(false);
        }
    }, [userId]);

    console.log("data ", data);

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
            <Flex justifyContent="flex-start">
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
                        <Circle m="1" size="1.5em" bg="red.500">
                            <Text color="white">99</Text>
                        </Circle>
                        <Text fontSize="l" ml="1">
                            Notifications
                        </Text>
                    </Flex>
                    <Notifications />
                </Flex>
            </Flex>
        </Flex>
    );
    return loading ? spinner : content;
};

export default HomeNotifications;
