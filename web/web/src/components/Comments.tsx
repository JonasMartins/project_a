import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import FlexSpinner from "./../components/rootComponents/FlexSpinner";
import {
    Maybe,
    Comment,
    User,
    useGetCommentsByItemQuery,
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
} from "@chakra-ui/react";
import { Form, Formik, Field } from "formik";
import { getServerPathImage } from "./../utils/handleServerImagePaths";

interface commentsProps {
    itemId: string;
    updateCallback: (number) => void;
    countUpdate: number;
}

interface newComment {
    itemId: string;
    body: string;
}

type commentsType = Array<
    { __typename?: "Comment" } & Pick<Comment, "id" | "body"> & {
            parent?: Maybe<
                { __typename?: "Comment" } & Pick<Comment, "id" | "body">
            >;
            item: { __typename?: "Item" } & Pick<Item, "id">;
            author: { __typename?: "User" } & Pick<User, "name" | "picture">;
        }
>;

const Comments: React.FC<commentsProps> = ({
    itemId,
    updateCallback,
    countUpdate,
}) => {
    const { colorMode } = useColorMode();
    const color = { light: "black", dark: "white" };
    const [comments, setComments] = useState<commentsType>(null);
    const [newComment, setNewComment] = useState<newComment>({
        itemId: itemId,
        body: "",
    });
    const bodyCommentRef = useRef<HTMLInputElement>(null);

    const [itemComments] = useGetCommentsByItemQuery({
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

        bodyCommentRef.current.focus();

        if (itemComments?.data?.getCommentsByItem?.comments) {
            setComments(itemComments.data.getCommentsByItem.comments);
            updateCallback(countUpdate + 1);
        }
    }, [itemId, itemComments.fetching]);

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
                    onSubmit={(values) => {
                        console.log("values ", values);
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
                    >
                        <Text>{comment.body}</Text>
                        <Flex justifyContent="flex-end">
                            <Text fontSize="sm" as="em" mr={1}>
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
                        </Flex>
                    </Flex>
                ))}
        </Flex>
    );

    return itemComments.fetching ? <FlexSpinner /> : content;
};

export default Comments;
