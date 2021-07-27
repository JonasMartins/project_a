import { Box, Text } from "@chakra-ui/react";
import React from "react";

interface HomeNotificationsProps {}

const HomeNotifications: React.FC<HomeNotificationsProps> = ({}) => {
    return (
        <Box p="6" m={3}>
            <Text fontSize="xl">Your Work</Text>
            <Box boxShadow="xl" rounded="md">
                <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Repudiandae excepturi sint natus inventore recusandae autem
                    sequi totam ipsa culpa ex numquam laboriosam assumenda
                    doloribus quod consequatur, facere eveniet fuga!
                    Dignissimos.
                </Text>
            </Box>
        </Box>
    );
};

export default HomeNotifications;
