import React, { ChangeEvent, useEffect, useState, useRef } from "react";
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
} from "@chakra-ui/react";
import { Form, Formik, Field } from "formik";
import { getServerPathImage } from "./../utils/handleServerImagePaths";
import { HiOutlineReply } from "react-icons/hi";
import { truncateString } from "./../helpers/generalUtilitiesFunctions";
import { useUser } from "./../helpers/hooks/useUser";
import { toErrorMap } from "../utils/toErrorMap";

interface commentsProps {
    itemId: string;
}

interface newComment {
    itemId: string;
    body: string;
}

type commentsType = Array<
    { __typename?: "Comment" } & Pick<Comment, "id" | "body" | "order"> & {
            parent?: Maybe<
                { __typename?: "Comment" } & Pick<Comment, "id" | "body">
            >;
            author: { __typename?: "User" } & Pick<User, "name" | "picture">;
            item: { __typename?: "Item" } & Pick<Item, "id">;
            replies: Array<
                { __typename?: "Comment" } & Pick<
                    Comment,
                    "id" | "body" | "order"
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
    const [hasCreatedComment, setHasCreatedComment] = useState(0);
    const [loading, setLoading] = useState(false);
    const [parentCommentId, setParentCommentId] = useState<string>("");
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
        console.log("here?");
        if (itemComments.fetching) {
            return;
        }

        //bodyCommentRef && bodyCommentRef.current.focus();

        if (itemComments?.data?.getCommentsByItem?.comments) {
            console.log(
                "length ",
                itemComments?.data?.getCommentsByItem.comments.length
            );

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
                            parentId: parentCommentId,
                            order: parentCommentId ? 2 : 1,
                        });

                        if (response.data?.createComment?.errors) {
                            setErrors(
                                toErrorMap(response.data.createComment.errors)
                            );
                            setLoading(false);
                        } else {
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
                        bg={
                            comment.order > 1
                                ? darkerBg[colorMode]
                                : normalBg[colorMode]
                        }
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
                                        <Button size="xs">{`Replies (${comment.replies.length})`}</Button>
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
                                            setParentCommentId(comment.id);
                                            bodyCommentRef.current.focus();
                                        }}
                                    />
                                </Tooltip>
                            </Flex>
                        </Flex>
                    </Flex>
                ))}
        </Flex>
    );

    return itemComments.fetching || loading ? <MiniSpinner /> : content;
};

export default Comments;
