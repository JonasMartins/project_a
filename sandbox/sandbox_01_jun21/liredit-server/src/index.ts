import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
    const orm = await MikroORM.init(microConfig); // connect to database
    orm.getMigrator().up(); // run migrations

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false,
        }),
        // special object accesible for all resolvers
        context: () => ({ em: orm.em }),
    });
    // creating a graphql endpoint
    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("server running at port 4000");
    });
};

main().catch((err) => {
    console.error(err);
});
