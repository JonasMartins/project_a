import { Box, Square, Tooltip, Text } from "@chakra-ui/react";
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
import {
    ItemPriority,
    ItemStatus,
    Maybe,
    Sprint,
    Project,
    Item,
    ItemType,
    User,
} from "./../../generated/graphql";

export type itemQuery = {
    __typename?: "Item";
} & Pick<
    Item,
    "id" | "description" | "summary" | "status" | "priority" | "type"
> & {
        responsible: {
            __typename?: "User";
        } & Pick<User, "id" | "name" | "picture">;
        approver: {
            __typename?: "User";
        } & Pick<User, "id" | "name" | "picture">;
        reporter: {
            __typename?: "User";
        } & Pick<User, "id" | "name" | "picture">;
    };

export type itemBacklog = { __typename?: "Item" } & Pick<
    Item,
    | "id"
    | "summary"
    | "type"
    | "priority"
    | "status"
    | "createdAt"
    | "updatedAt"
    | "description"
> & {
        responsible: { __typename?: "User" } & Pick<User, "id" | "name">;
        reporter: { __typename?: "User" } & Pick<User, "id" | "name">;
        sprint: { __typename?: "Sprint" } & Pick<
            Sprint,
            "code" | "createdAt" | "length" | "final"
        > & {
                project: { __typename?: "Project" } & Pick<Project, "name">;
            };
    };

export type itensBacklog = {
    itens?: Maybe<
        Array<
            { __typename?: "Item" } & Pick<
                Item,
                | "id"
                | "summary"
                | "type"
                | "priority"
                | "status"
                | "createdAt"
                | "updatedAt"
                | "description"
            > & {
                    responsible: { __typename?: "User" } & Pick<
                        User,
                        "id" | "name"
                    >;
                    reporter: { __typename?: "User" } & Pick<
                        User,
                        "id" | "name"
                    >;
                    sprint: { __typename?: "Sprint" } & Pick<
                        Sprint,
                        "code" | "createdAt" | "length" | "final"
                    > & {
                            project: { __typename?: "Project" } & Pick<
                                Project,
                                "name"
                            >;
                        };
                }
        >
    >;
};

export type itemRelatedToUser = { __typename?: "Item" } & Pick<
    Item,
    | "id"
    | "summary"
    | "description"
    | "status"
    | "type"
    | "priority"
    | "responsible_id"
    | "reporter_id"
    | "approver_id"
> & {
        sprint: { __typename?: "Sprint" } & {
            project: { __typename?: "Project" } & Pick<Project, "id">;
        };
    };

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

export const returnHeaderGradient = (type: enumItemType | ItemType): string => {
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

export const returnIconHeaderLabel = (
    type: enumItemType | ItemType
): JSX.Element => {
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
    let size = "30px";
    switch (type) {
        case "HIGHEST":
            componentType = (
                <Tooltip
                    hasArrow
                    aria-label="Highest Priority"
                    label="Highest Priority"
                >
                    <Box ml={2} bg="black" rounded="full" h={size}>
                        <CgArrowUpO color="#ad032c" size={size} />
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
                    <Box ml={2} bg="black" rounded="full" h={size}>
                        <CgArrowTopRightO color="#d36a13" size={size} />
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
                    <Box ml={2} bg="black" rounded="full" h={size}>
                        <CgArrowRightO color="#f6de56" size={size} />
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
                    <Box ml={2} bg="black" rounded="full" h={size}>
                        <CgArrowBottomLeftO color="#63ace8" size={size} />
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
                    <Box ml={2} bg="black" rounded="full" h={size}>
                        <CgArrowDownO color="white" size={size} />
                    </Box>
                </Tooltip>
            );
            break;
    }
    return componentType;
};

export const returnItemStatusStyled = (status: ItemStatus): JSX.Element => {
    let componentType: JSX.Element | null = null;
    switch (status) {
        case "OPEN":
            componentType = (
                <Text fontWeight="semibold" textShadow="#f6de56 1px 0 10px">
                    OPEN
                </Text>
            );
            break;
        case "REOPENED":
            componentType = (
                <Text fontWeight="semibold" textShadow="#f6ad55 1px 0 10px">
                    REOPENED
                </Text>
            );
            break;
        case "IN_PROGRESS":
            componentType = (
                <Text fontWeight="semibold" textShadow="#7fe7fb 1px 0 10px">
                    IN PROGRESS
                </Text>
            );
            break;
        case "CLOSED":
            componentType = (
                <Text fontWeight="semibold" textShadow="#58c184 1px 0 10px">
                    CLOSED
                </Text>
            );
            break;
        case "RESOLVED":
            componentType = (
                <Text fontWeight="semibold" textShadow="#3994e0 1px 0 10px">
                    RESOLVED
                </Text>
            );
            break;
        default:
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
