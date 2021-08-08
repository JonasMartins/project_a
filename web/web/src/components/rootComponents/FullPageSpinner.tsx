import React from "react";
import { Container } from "../Container";
import { Spinner, Box } from "@chakra-ui/react";
interface SpinnerProps {}

const FullPageSpinner: React.FC<SpinnerProps> = ({}) => {
    return (
        <Container>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Spinner size="xl" />
            </Box>
        </Container>
    );
};
export default FullPageSpinner;
