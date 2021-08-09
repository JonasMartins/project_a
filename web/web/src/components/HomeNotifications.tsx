import { Box, Text, Button } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { GlobalContext } from "./../context/globalContext";
import FullPageSpinner from "./../components/rootComponents/FullPageSpinner";
import { useGetUserByIdQuery } from "./../generated/graphql";

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
        <Box p="6" m={3}>
            <Text fontSize="xl">
                Welcome {data ? data.getUserById?.user?.name : ""}
            </Text>
            <Box boxShadow="xl" rounded="md">
                <Text>{data ? data.getUserById?.user?.email : null}</Text>
            </Box>
        </Box>
    );
    return loading ? spinner : content;
};

export default HomeNotifications;
