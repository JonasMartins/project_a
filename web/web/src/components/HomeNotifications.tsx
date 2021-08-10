import { Box, Text, Link, Flex, Circle } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { GlobalContext } from "./../context/globalContext";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import { useGetUserByIdQuery } from "./../generated/graphql";
import { FcDocument } from "react-icons/fc";
import NextLink from "next/link";
import { PhoneIcon } from "@chakra-ui/icons";

interface HomeNotificationsProps {}

const HomeNotifications: React.FC<HomeNotificationsProps> = ({}) => {
    const { userId, loading, setIsLoading } = useContext(GlobalContext);

    //setIsLoading(true);

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
                <Flex boxShadow="xl" p="2" m="2" rounded="md" flexDir="column">
                    <Flex flexDir="row" alignItems="center">
                        <Circle m="1" size="1.5em" bg="red.500">
                            <Text color="white">1</Text>
                        </Circle>
                        <Text fontSize="l" ml="1">
                            Notifications
                        </Text>
                    </Flex>
                    <Text fontSize="m" m="2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Eum, modi deleniti. Ut blanditiis, dolorem
                        pariatur quae necessitatibus officia minus rem quasi,
                        ducimus cumque impedit nesciunt, nobis omnis autem
                        dolorum. Nostrum?
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
    return loading ? spinner : content;
};

export default HomeNotifications;
