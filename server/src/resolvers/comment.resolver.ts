import {
    Arg,
    Mutation,
    Resolver,
    ObjectType,
    Field,
    Ctx,
    Query,
} from "type-graphql";
import { Comment } from "../entities/comments.entity";
import { Context } from "../types";
import { ErrorFieldHandler } from "../utils/errorFieldHandler";
import { genericError } from "./../utils/generalAuxiliaryMethods";
import { EntityManager } from "@mikro-orm/postgresql"; // or any other driver package
import { Item } from "../entities/item.entity";
import e from "express";
import { User } from "../entities/user.entity";

@ObjectType()
class CommentResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Comment, { nullable: true })
    comment?: Comment;
}

@ObjectType()
class CommentsResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => [Comment], { nullable: true })
    comments?: Comment[];
    @Field()
    total?: Number;
}

@Resolver()
export class CommentResolver {
    @Query(() => CommentResponse)
    async getCommentById(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<CommentResponse> {
        if (!id) {
            return {
                errors: genericError(
                    "id",
                    "getCommentById",
                    __filename,
                    "An Id must be passed as argument"
                ),
            };
        }

        const comment: Comment | null = await em.findOne(Comment, { id });

        if (!comment) {
            return {
                errors: genericError(
                    "id",
                    "getCommentById",
                    __filename,
                    `The comment with id: ${id}, could not been found`
                ),
            };
        }

        return { comment };
    }

    @Query(() => CommentsResponse)
    async getCommentsByItem(
        @Arg("itemId") itemId: string,
        @Ctx() { em }: Context
    ): Promise<CommentsResponse> {
        if (!itemId) {
            return {
                errors: genericError(
                    "id",
                    "getCommentById",
                    __filename,
                    "An Id must be passed as argument"
                ),
            };
        }

        const qb = (em as EntityManager).createQueryBuilder(Comment);

        qb.select("*")
            .where({ item_id: itemId })
            .orderBy({ updatedAt: "DESC" });

        try {
            const comments = await qb.getResult();
            await em.populate(comments, ["replies"]);
            await em.populate(comments, ["author"]);

            const total = comments.length;

            return { comments, total };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getCommentsByItem",
                    __filename,
                    `message: ${e.message}`
                ),
            };
        }
    }

    @Mutation(() => CommentResponse)
    async createComment(
        @Arg("body", () => String) body: string,
        @Arg("itemId", () => String) itemId: string,
        @Arg("authorId", () => String) authorId: string,
        @Arg("parentId", () => String, { nullable: true }) parentId: string,
        @Ctx() { em }: Context
    ): Promise<CommentResponse> {
        if (!authorId) {
            return {
                errors: genericError(
                    "id",
                    "createComment",
                    __filename,
                    "An User id must be passed as argument"
                ),
            };
        }

        const author: User | null = await em.findOne(User, { id: authorId });

        if (!author) {
            return {
                errors: genericError(
                    "authorId",
                    "createComment",
                    __filename,
                    `The author with id ${authorId} could not been found.`
                ),
            };
        }

        if (!itemId) {
            return {
                errors: genericError(
                    "itemId",
                    "createComment",
                    __filename,
                    "An Id must be passed as argument"
                ),
            };
        }

        const item: Item | null = await em.findOne(Item, { id: itemId });

        if (!item) {
            return {
                errors: genericError(
                    "itemId",
                    "createComment",
                    __filename,
                    `The item with id: ${itemId}, could not been found`
                ),
            };
        }

        let parent: Comment | null = null;

        if (parentId) {
            parent = await em.findOne(Comment, {
                id: parentId,
            });

            if (!parent) {
                return {
                    errors: genericError(
                        "parentId",
                        "createComment",
                        __filename,
                        `The parent comment with id: ${parentId}, could not been found`
                    ),
                };
            }
        }

        const comment = await em.create(Comment, {
            body: body,
            item: item,
            parent: parent,
        });

        comment.body = body;
        comment.author = author;

        try {
            await em.persistAndFlush(comment);
            return { comment };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "createComment",
                    __filename,
                    `message: ${e.message}`
                ),
            };
        }
    }
}
