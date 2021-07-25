import "dotenv/config";
import express from "express";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Context } from "./types";
import { UserResolver } from "./resolvers/user";
import cors from "cors";

const main = async () => {
    const orm = await MikroORM.init(microConfig); // connect to
    //orm.getMigrator().up(); // run migrations

    const app = express();

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
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
        console.log("The application is listening on port 4000!");
    });
};

main().catch((err) => {
    console.error(err);
});
