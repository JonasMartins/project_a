import React from "react";
import { Container } from "../Container";
import { Spinner, Flex } from "@chakra-ui/react";
interface FlexSpinnerProps {}

const FlexSpinner: React.FC<FlexSpinnerProps> = ({}) => {
    return (
        <Flex flexGrow={1} justifyContent="center" alignItems="center">
            <Spinner size="xl" />
        </Flex>
    );
};
export default FlexSpinner;
