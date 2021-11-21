import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { formatDistance } from "date-fns";
import MiniSpinner from "./../components/rootComponents/MiniSpinner";
import {
    Maybe,
    Comment,
    User,
    useGetCommentsByItemQuery,
    useCreateCommentMutation,
} from "./../generated/graphql";
import {
    Flex,
    FormControl,
    Textarea,
    Stack,
    Text,
    FormErrorMessage,
    Button,
    Image,
    useColorMode,
    Tooltip,
    IconButton,
    useDisclosure,
    Fade,
    Box,
    Collapse,
} from "@chakra-ui/react";
import { Form, Formik, Field } from "formik";
import { getServerPathImage } from "./../utils/handleServerImagePaths";
import { HiOutlineReply } from "react-icons/hi";
import { truncateString } from "./../helpers/generalUtilitiesFunctions";
import { useUser } from "./../helpers/hooks/useUser";
import { toErrorMap } from "../utils/toErrorMap";
import { CloseButton } from "@chakra-ui/react";

interface commentsProps {
    itemId: string;
}

interface newComment {
    itemId: string;
    parentId?: string;
    body: string;
    parentName?: string;
    parentCreated?: Date;
}

type commentsType = Array<
    { __typename?: "Comment" } & Pick<
        Comment,
        "id" | "body" | "order" | "createdAt"
    > & {
            parent?: Maybe<
                { __typename?: "Comment" } & Pick<Comment, "id" | "body">
            >;
            author: { __typename?: "User" } & Pick<User, "name" | "picture">;
            item: { __typename?: "Item" } & Pick<Item, "id">;
            replies: Array<
                { __typename?: "Comment" } & Pick<
                    Comment,
                    "id" | "body" | "order" | "createdAt"
                > & {
                        author: { __typename?: "User" } & Pick<
                            User,
                            "name" | "picture"
                        >;
                    }
            >;
        }
>;

const Comments: React.FC<commentsProps> = ({ itemId }) => {
    const user = useUser();

    const handleReplyInfo = useDisclosure();
    const handleShowReply = useDisclosure();
    const [hasCreatedComment, setHasCreatedComment] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentParentCommentId, setCurrentParentCommentId] = useState("");
    const [parentComment, setParentComment] = useState<newComment>({
        itemId: "",
        body: "",
        parentName: "",
        parentId: "",
        parentCreated: null,
    });
    const [comments, setComments] = useState<commentsType>(null);
    const [newComment, setNewComment] = useState<newComment>({
        itemId: itemId,
        body: "",
    });
    const { colorMode } = useColorMode();
    const normalBg = { light: "gray.50", dark: "gray.700" };
    const darkerBg = { light: "gray.100", dark: "gray.800" };

    const bodyCommentRef = useRef<HTMLInputElement>(null);

    const [{}, createComment] = useCreateCommentMutation();

    const [itemComments, reexecuteQuery] = useGetCommentsByItemQuery({
        variables: {
            itemId: itemId,
        },
    });

    const handleCommentBody = (e: ChangeEvent<HTMLInputElement>) => {
        setNewComment((comment) => ({
            ...comment,
            body: e.target.value,
        }));
    };

    useEffect(() => {
        if (itemComments.fetching) {
            return;
        }

        if (itemComments?.data?.getCommentsByItem?.comments) {
            setComments(
                itemComments.data.getCommentsByItem.comments.filter(
                    (comment) => {
                        return !comment.parent;
                    }
                )
            );
        }
    }, [itemId, itemComments.fetching, hasCreatedComment, loading]);

    const content = (
        <Flex
            boxShadow="lg"
            justifyContent="center"
            p={3}
            flexDir="column"
            flexGrow={1}
        >
            <Text fontWeight="semibold">Comments</Text>
            <Fade in={handleReplyInfo.isOpen}>
                <Flex p={1} m={1} flexDir="column">
                    <Flex justifyContent="space-between">
                        <Text
                            as="em"
                            fontWeight="semibold"
                            fontSize="sm"
                            textShadow="#f6ad55 1px 0 10px"
                        >
                            Replying to:
                        </Text>
                        <CloseButton
                            size="sm"
                            onClick={() => {
                                setParentComment((parent) => ({
                                    ...parent,
                                    parentId: "",
                                    body: "",
                                    parentName: "",
                                }));
                                handleReplyInfo.onClose();
                            }}
                        />
                    </Flex>
                    <Box bg={darkerBg[colorMode]} p={2}>
                        <Text as="em" fontSize="sm">
                            {truncateString(parentComment.body, 50)}
                        </Text>
                        <Flex justifyContent="flex-end">
                            <Text as="em" fontSize="sm">{`${
                                parentComment.parentName
                            }, ${formatDistance(
                                new Date(parentComment.parentCreated),
                                new Date(),
                                { addSuffix: true }
                            )}`}</Text>{" "}
                        </Flex>
                    </Box>
                </Flex>
            </Fade>

            <Flex p={2} justifyContent="center" flexGrow={1} flexFlow="inherit">
                <Formik
                    initialValues={{
                        itemId: newComment.itemId,
                        body: newComment.body,
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { setErrors }) => {
                        setLoading(true);
                        const response = await createComment({
                            body: values.body,
                            itemId: values.itemId,
                            authorId: user.userId,
                            parentId: parentComment.parentId,
                            order: parentComment.parentId ? 2 : 1,
                        });

                        if (response.data?.createComment?.errors) {
                            setErrors(
                                toErrorMap(response.data.createComment.errors)
                            );
                            setLoading(false);
                        } else {
                            setParentComment((parent) => ({
                                ...parent,
                                parentId: "",
                                body: "",
                                parentName: "",
                            }));
                            handleReplyInfo.onClose();
                            setNewComment((comment) => ({
                                ...comment,
                                body: "",
                            }));
                            reexecuteQuery({
                                requestPolicy: "cache-and-network",
                            });
                            setHasCreatedComment(hasCreatedComment + 1);
                            setTimeout(() => {
                                setLoading(false);
                            }, 300);
                        }
                    }}
                >
                    {(props) => (
                        <Form {...props}>
                            <Stack spacing={3}>
                                <Field name="body">
                                    {({ field, form }) => (
                                        <FormControl
                                            isInvalid={form.errors.body}
                                        >
                                            <Textarea
                                                {...field}
                                                isRequired
                                                ref={bodyCommentRef}
                                                value={newComment.body}
                                                placeholder="Share a comment..."
                                                size="sm"
                                                onChange={handleCommentBody}
                                            />
                                            <FormErrorMessage>
                                                {form.errors.body}
                                            </FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Flex justifyContent="flex-end">
                                    <Button
                                        type="submit"
                                        isLoading={props.isSubmitting}
                                        isDisabled={newComment.body.length < 3}
                                        variant="cyan-gradient"
                                        size="sm"
                                    >
                                        Share
                                    </Button>
                                </Flex>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Flex>

            {comments &&
                comments.map((comment) => (
                    <Flex
                        boxShadow="md"
                        p={4}
                        key={comment.id}
                        flexDir="column"
                        bg={normalBg[colorMode]}
                    >
                        <Text>{comment.body}</Text>

                        <Flex
                            alignItems="baseline"
                            justifyContent="space-between"
                        >
                            <Flex>
                                {comment.replies.length ? (
                                    <Tooltip
                                        hasArrow
                                        aria-label="Replies"
                                        label="Show replies"
                                        colorScheme="withe"
                                    >
                                        <Button
                                            size="xs"
                                            onClick={() => {
                                                handleShowReply.onToggle();
                                                setCurrentParentCommentId(
                                                    comment.id
                                                );
                                            }}
                                        >{`Replies (${comment.replies.length})`}</Button>
                                    </Tooltip>
                                ) : (
                                    <></>
                                )}
                            </Flex>
                            <Flex alignItems="center">
                                {comment.parent ? (
                                    <Text fontSize="xs" as="em" mr={4}>
                                        Reply to:{" "}
                                        {truncateString(
                                            comment.parent.body,
                                            20
                                        )}{" "}
                                    </Text>
                                ) : (
                                    <></>
                                )}

                                <Text fontSize="xs" as="em" mr={1}>
                                    Author:
                                </Text>
                                <Tooltip
                                    hasArrow
                                    aria-label="Author"
                                    label={comment.author.name}
                                    colorScheme="withe"
                                >
                                    <Image
                                        borderRadius="full"
                                        boxSize="24px"
                                        src={getServerPathImage(
                                            comment.author.picture
                                        )}
                                    />
                                </Tooltip>
                                <Text fontSize="xs" as="em" mr={1} ml={2}>
                                    {formatDistance(
                                        new Date(comment.createdAt),
                                        new Date(),
                                        { addSuffix: true }
                                    )}
                                </Text>

                                <Tooltip
                                    hasArrow
                                    aria-label="Reply"
                                    label="Reply this comment"
                                    colorScheme="withe"
                                >
                                    <IconButton
                                        ml={3}
                                        isRound={true}
                                        variant="cyan-gradient"
                                        aria-label="reply"
                                        icon={<HiOutlineReply />}
                                        onClick={() => {
                                            setParentComment((parent) => ({
                                                ...parent,
                                                parentId: comment.id,
                                                body: comment.body,
                                                parentName: comment.author.name,
                                                parentCreated:
                                                    comment.createdAt,
                                            }));
                                            bodyCommentRef.current.focus();
                                            handleReplyInfo.onOpen();
                                        }}
                                    />
                                </Tooltip>
                            </Flex>
                        </Flex>
                        <Collapse in={handleShowReply.isOpen}>
                            {comment.replies &&
                                comment.id == currentParentCommentId &&
                                comment.replies.map((reply) => (
                                    <Flex
                                        bg={darkerBg[colorMode]}
                                        p={4}
                                        mt={2}
                                        key={reply.id}
                                        flexDir="column"
                                    >
                                        <Text>{reply.body}</Text>
                                        <Flex
                                            alignItems="center"
                                            justifyContent="flex-end"
                                        >
                                            <Text fontSize="xs" as="em" mr={1}>
                                                Author:
                                            </Text>
                                            <Tooltip
                                                hasArrow
                                                aria-label="Author"
                                                label={reply.author.name}
                                                colorScheme="withe"
                                            >
                                                <Image
                                                    borderRadius="full"
                                                    boxSize="24px"
                                                    src={getServerPathImage(
                                                        reply.author.picture
                                                    )}
                                                />
                                            </Tooltip>
                                            <Text
                                                fontSize="xs"
                                                as="em"
                                                mr={1}
                                                ml={2}
                                            >
                                                {formatDistance(
                                                    new Date(reply.createdAt),
                                                    new Date(),
                                                    { addSuffix: true }
                                                )}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                ))}
                        </Collapse>
                    </Flex>
                ))}
        </Flex>
    );

    return itemComments.fetching || loading ? <MiniSpinner /> : content;
};

export default Comments;
