import { Post } from "./../entities/Post";
import { MyContext } from "./../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg("id", () => Int) id: number,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        return em.findOneOrFail(Post, { id });
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title", () => String) title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post> {
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg("id", () => Int) id: number,
        @Arg("title", () => String) title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOneOrFail(Post, { id });

        if (typeof title !== undefined) {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id", () => Int) id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {
        const result = await em.nativeDelete(Post, { id });
        if (!result) {
            throw new Error(`Could not delete the post with id: ${id}`);
        }

        return !!result;
    }
}
