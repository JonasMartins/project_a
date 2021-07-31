import "dotenv/config";
import express from "express";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Context } from "./types";
import { UserResolver } from "./resolvers/user.resolver";
import cors from "cors";
import cookieParser from "cookie-parser";
import { COOKIE_NAME } from "./utils/cons";
import { verify } from "jsonwebtoken";
import { User } from "./entities/user.entity";
import { sendRefreshToken } from "./utils/sendRefreshToken";
import { createAcessToken, createRefreshToken } from "./utils/auth";
import { ItemResolver } from "./resolvers/item.resolver";

type failedRefresh = {
    ok: boolean;
    accessToken: string;
};

const main = async () => {
    const orm = await MikroORM.init(microConfig); // connect to
    //orm.getMigrator().up(); // run migrations

    const app = express();

    app.use(cookieParser());

    app.use(
        cors({
            origin: process.env.DEV_FRONT_URL,
            credentials: true,
        })
    );

    // refresh token
    app.post("/refresh_token", async (req, res) => {
        // yarn add cookie-parser
        // yarn add -D @types/cookie-parser
        const token = req.cookies[COOKIE_NAME];
        const failedRefresh: failedRefresh = { ok: false, accessToken: "" };
        if (!token) {
            return res.send(failedRefresh);
        }
        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
        } catch (e) {
            return res.send(failedRefresh);
        }

        // token is valid
        const user = await orm.em.findOne(User, { id: payload.userId });

        if (!user) {
            return res.send(failedRefresh);
        }

        // compare tokenVersions
        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send(failedRefresh);
        }

        sendRefreshToken(res, createRefreshToken(user));

        return res.send({ ok: true, accessToken: createAcessToken(user) });
    });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, ItemResolver],
            validate: false,
        }),
        // special object accesible for all resolvers
        context: ({ req, res }): Context => ({ em: orm.em, req, res }),
    });

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    app.listen(4001, () => {
        console.log("The application is listening on port 4001!");
    });
};

main().catch((err) => {
    console.error(err);
});
