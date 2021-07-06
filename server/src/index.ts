import express from "express";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Context } from "./types";
import { UserResolver } from "./resolvers/user";

const main = async () => {
    const orm = await MikroORM.init(microConfig); // connect to

    const app = express();

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
    });

    app.listen(4001, () => {
        console.log("The application is listening on port 4000!");
    });
};

main().catch((err) => {
    console.error(err);
});
