import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(microConfig); // connect to database
    orm.getMigrator().up(); // run migrations
    const post = orm.em.create(Post, { title: "First Post" }); // run a sql
    await orm.em.persistAndFlush(post); // persist on table
};

main().catch((err) => {
    console.error(err);
});
