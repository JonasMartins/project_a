import { Box, Flex, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/globalContext";
import { Container } from "./../../components/Container";
import SideBar from "./../../components/layout/SideBar";
import Footer from "./../../components/rootComponents/Footer";
import Navbar from "./../../components/rootComponents/Navbar";

interface TeamProps {}

const Team: React.FC<TeamProps> = () => {
    const { expanded } = useContext(GlobalContext);
    const [pageWidth, setPageWidth] = useState("3em");
    const [navBarWidth, setNavBarWidth] = useState("50px");

    useEffect(() => {
        if (expanded) {
            setPageWidth("20em");
            setNavBarWidth("16em");
        } else {
            setPageWidth("3em");
            setNavBarWidth("50px");
        }
    }, [expanded]);

    const content = (
        <Container>
            <Navbar pageWidth={navBarWidth} />
            <SideBar />
            <Flex
                alignSelf="normal"
                flexDir="column"
                flexGrow={1}
                mb="150px"
                ml={pageWidth}
                transition="0.3s"
            >
                <Flex flexDir="row" alignItems="center" p={2}>
                    <NextLink href={"/"}>
                        <Link>
                            <Text>Home</Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>
                    <NextLink href={"/team"}>
                        <Link>
                            <Text>Teams</Text>
                        </Link>
                    </NextLink>
                    <Text color="gray.500" ml={2} mr={2}>
                        {">"}
                    </Text>
                </Flex>
                <Text p={2} fontSize="lg" fontWeight="semibold" ml={2}>
                    Teams
                </Text>
            </Flex>
            <Box id="footer">
                <Footer />
            </Box>
        </Container>
    );

    return content;
};

export default Team;
