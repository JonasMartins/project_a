import React from "react";
import { Flex, Link, Box, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";

interface NextBreadcrumbProps {
    path: { href: string; title: string }[];
}

const NextBreadcrumb: React.FC<NextBreadcrumbProps> = ({ path }) => {
    return (
        <Flex flexDir="row">
            {path &&
                path.map((item) => {
                    // {
                    //     console.log("item ", item);
                    // }
                    <Box m={2}>
                        <NextLink href={item.href}>
                            <Link>
                                <Text>{item.title}</Text>
                            </Link>
                            <ChevronRightIcon color="gray.500" />
                        </NextLink>
                    </Box>;
                })}
        </Flex>
    );
};

export default NextBreadcrumb;
