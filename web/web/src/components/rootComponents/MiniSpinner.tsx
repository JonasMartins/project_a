import React from "react";
import { Spinner, Flex } from "@chakra-ui/react";
interface MiniSpinnerProps {}

const MiniSpinner: React.FC<MiniSpinnerProps> = ({}) => {
    return (
        <Flex flexGrow={1} justifyContent="center" alignItems="center">
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
            />
        </Flex>
    );
};
export default MiniSpinner;
