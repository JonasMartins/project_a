import {
    Resolver,
    Query,
    Ctx,
    Arg,
    ObjectType,
    Field,
    Mutation,
} from "type-graphql";
import { News } from "./../entities/news.entity";
import { Context } from "../types";
import { ErrorFieldHandler } from "../utils/errorFieldHandler";
import { User } from "../entities/user.entity";
import { NewsRelatedUsers } from "../entities/newsRelatedUsers.entity";
import { genericError } from "../utils/generalAuxiliaryMethods";
import { EntityManager } from "@mikro-orm/postgresql";

@ObjectType()
class NewsResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => [News])
    news?: News[];
}

@Resolver()
export class NewsResolver {
    @Query(() => NewsResponse)
    async getNewsRelatedToUser(
        @Arg("userId") userId: string,
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Ctx() { em }: Context
    ): Promise<NewsResponse> {
        const max = Math.min(30, limit);
        const user = await em.findOne(User, { id: userId });

        if (!user) {
            return {
                errors: genericError(
                    "userId",
                    "getNewsRelatedToUser",
                    __filename,
                    `Could not found user with id ${userId}`
                ),
            };
        }

        const qb = (em as EntityManager).createQueryBuilder(NewsRelatedUsers);

        qb.select("*").where({ user_id: userId }).limit(max);

        const usersNews = await qb.getResult();

        if (!usersNews.length) {
            return { news: [] };
        }

        let arrNewsId: string[] = [];

        usersNews.forEach((userNews) => {
            arrNewsId.push(userNews.news_id);
        });

        const news = await em.find(News, { id: arrNewsId });

        return { news };
    }

    @Mutation(() => NewsResponse)
    async createNews(
        @Arg("description") description: string,
        @Arg("creator_id") creator_id: string,
        @Arg("usersRelated", () => [String], { nullable: true })
        usersRelated: string[],
        @Ctx() { em }: Context
    ): Promise<NewsResponse> {
        const creator = await em.findOne(User, { id: creator_id });

        if (!creator) {
            return {
                errors: genericError(
                    "creator_id",
                    "createNews",
                    __filename,
                    `Could not found user with id ${creator_id}`
                ),
            };
        }

        const news = em.create(News, {
            description,
            creator_id,
        });

        await em.persistAndFlush(news);
        await news.relatedUsers.init();
        if (usersRelated) {
            const usersNews = await em.find(User, {
                id: usersRelated,
            });

            if (usersNews) {
                usersNews.map((user) => news.relatedUsers.add(user));
            }
        }
        news.relatedUsers.add(creator);
        await em.persistAndFlush(news);

        return { news: [news] };
    }
}
