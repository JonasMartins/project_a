import { Box, Square } from "@chakra-ui/react";
import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsFillBookmarkFill } from "react-icons/bs";
import { IoMdBug } from "react-icons/io";
import {
    CgArrowUpO,
    CgArrowTopRightO,
    CgArrowRightO,
    CgArrowBottomLeftO,
    CgArrowDownO,
} from "react-icons/cg";
export const getItemTypeIcon = (type: string): JSX.Element => {
    let componentType: JSX.Element | null = null;

    switch (type) {
        case "BUG":
            componentType = (
                <Square
                    size="30px"
                    mr="1em"
                    mt="0.5"
                    bg="red.500"
                    color="white"
                >
                    <IoMdBug />
                </Square>
            );
            break;
        case "TASK":
            componentType = (
                <Square
                    size="30px"
                    mr="1em"
                    mt="0.5"
                    bg="blue.500"
                    color="white"
                >
                    <AiFillCheckCircle />
                </Square>
            );
            break;
        case "STORY":
            componentType = (
                <Square
                    size="30px"
                    mr="1em"
                    mt="0.5"
                    bg="green.500"
                    color="white"
                >
                    <BsFillBookmarkFill />
                </Square>
            );
            break;
    }

    return componentType;
};

export const returnHeaderGradient = (type: enumItemType): string => {
    let stringGradientInfo = "";

    switch (type) {
        case "BUG":
            stringGradientInfo = "linear(to-l, red.200, red.500)";
            break;
        case "TASK":
            stringGradientInfo = "linear(to-l, blue.200, blue.500)";
            break;
        case "STORY":
            stringGradientInfo = "linear(to-l, green.200, green.500)";
            break;
    }
    return stringGradientInfo;
};

export const returnIconHeaderLabel = (type: enumItemType): JSX.Element => {
    let componentType: JSX.Element | null = null;
    switch (type) {
        case "BUG":
            componentType = (
                <Box ml={2}>
                    <IoMdBug color="white" />
                </Box>
            );
            break;
        case "TASK":
            componentType = (
                <Box ml={2}>
                    <AiFillCheckCircle color="white" />
                </Box>
            );
            break;
        case "STORY":
            componentType = (
                <Box ml={2}>
                    <BsFillBookmarkFill color="white" />
                </Box>
            );
            break;
    }
    return componentType;
};

export const returnPriorityIconHeaderModal = (
    type: enumItemPriority
): JSX.Element => {
    let componentType: JSX.Element | null = null;

    switch (type) {
        case "HIGHEST":
            componentType = (
                <Box ml={2}>
                    <CgArrowUpO color="#ad032c" size="35px" />
                </Box>
            );
            break;
        case "HIGH":
            componentType = (
                <Box ml={2}>
                    <CgArrowTopRightO color="#d36a13" size="35px" />
                </Box>
            );
            break;
        case "MEDIUM":
            componentType = (
                <Box ml={2}>
                    <CgArrowRightO color="#f6de56" size="35px" />
                </Box>
            );
            break;
        case "LOW":
            componentType = (
                <Box ml={2}>
                    <CgArrowBottomLeftO color="#63ace8" size="35px" />
                </Box>
            );
            break;
        case "LOWEST":
            componentType = (
                <Box ml={2}>
                    <CgArrowDownO color="white" size="35px" />
                </Box>
            );
            break;
    }
    return componentType;
};

export enum enumItemPriority {
    HIGHEST = "HIGHEST",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    LOWEST = "LOWEST",
}

export enum enumItemType {
    TASK = "TASK",
    BUG = "BUG",
    STORY = "STORY",
}
