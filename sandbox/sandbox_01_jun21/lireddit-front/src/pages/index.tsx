import React from "react";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlCleint } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box } from "@chakra-ui/react";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
    const [{ data }] = usePostsQuery();

    return (
        <>
            <NavBar />
            {!data ? (
                <div>Loading...</div>
            ) : (
                data.posts.map((post) => <Box key={post.id}>{post.title}</Box>)
            )}
        </>
    );
};

export default withUrqlClient(createUrqlCleint, { ssr: true })(Index);
