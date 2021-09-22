import { Box, Square, Tooltip } from "@chakra-ui/react";
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
import { ItemPriority } from "./../../generated/graphql";

export const getItemTypeIcon = (type: string): JSX.Element => {
    let componentType: JSX.Element | null = null;

    switch (type) {
        case "BUG":
            componentType = (
                <Tooltip hasArrow aria-label="Bug Item" label="Bug Item">
                    <Square
                        size="30px"
                        mr="1em"
                        mt="0.5"
                        bg="red.500"
                        color="white"
                    >
                        <IoMdBug />
                    </Square>
                </Tooltip>
            );
            break;
        case "TASK":
            componentType = (
                <Tooltip hasArrow aria-label="Task Item" label="Task Item">
                    <Square
                        size="30px"
                        mr="1em"
                        mt="0.5"
                        bg="blue.500"
                        color="white"
                    >
                        <AiFillCheckCircle />
                    </Square>
                </Tooltip>
            );
            break;
        case "STORY":
            componentType = (
                <Tooltip hasArrow aria-label="Story Item" label="Story Item">
                    <Square
                        size="30px"
                        mr="1em"
                        mt="0.5"
                        bg="green.500"
                        color="white"
                    >
                        <BsFillBookmarkFill />
                    </Square>
                </Tooltip>
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
    type: ItemPriority | enumItemPriority
): JSX.Element => {
    let componentType: JSX.Element | null = null;

    switch (type) {
        case "HIGHEST":
            componentType = (
                <Tooltip
                    hasArrow
                    aria-label="Highest Priority"
                    label="Highest Priority"
                >
                    <Box ml={2}>
                        <CgArrowUpO color="#ad032c" size="35px" />
                    </Box>
                </Tooltip>
            );
            break;
        case "HIGH":
            componentType = (
                <Tooltip
                    hasArrow
                    aria-label="High Priority"
                    label="High Priority"
                >
                    <Box ml={2}>
                        <CgArrowTopRightO color="#d36a13" size="35px" />
                    </Box>
                </Tooltip>
            );
            break;
        case "MEDIUM":
            componentType = (
                <Tooltip
                    hasArrow
                    aria-label="Medium Priority"
                    label="Medium Priority"
                >
                    <Box ml={2}>
                        <CgArrowRightO color="#f6de56" size="35px" />
                    </Box>
                </Tooltip>
            );
            break;
        case "LOW":
            componentType = (
                <Tooltip
                    hasArrow
                    aria-label="Low Priority"
                    label="Low Priority"
                >
                    <Box ml={2}>
                        <CgArrowBottomLeftO color="#63ace8" size="35px" />
                    </Box>
                </Tooltip>
            );
            break;
        case "LOWEST":
            componentType = (
                <Tooltip
                    hasArrow
                    aria-label="Lowest Priority"
                    label="Lowest Priority"
                >
                    <Box ml={2}>
                        <CgArrowDownO color="#ced8e4" size="35px" />
                    </Box>
                </Tooltip>
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
