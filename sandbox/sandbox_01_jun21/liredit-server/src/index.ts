import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import { FilterValue } from "@mikro-orm/core/typings";
import cors from "cors";

declare module "express-session" {
    interface Session {
        userId: FilterValue<number> | undefined;
    }
}

const main = async () => {
    const orm = await MikroORM.init(microConfig); // connect to database
    orm.getMigrator().up(); // run migrations

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 30 * 3, // three months
                httpOnly: true,
                secure: __prod__, // cookie only works in https
                sameSite: "lax", // csrf
            },
            saveUninitialized: false,
            secret: "secretPassword",
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        // special object accesible for all resolvers
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    });
    // creating a graphql endpoint
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    app.listen(4000, () => {
        console.log("server running at port 4000");
    });
};

main().catch((err) => {
    console.error(err);
});
