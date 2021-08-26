import { __prod__ } from "./constants";
import { Collection, MikroORM } from "@mikro-orm/core";
import path from "path";
import { Item } from "./entities/item.entity";
import { User } from "./entities/user.entity";
import { Role } from "./entities/role.entity";

const microConfig = {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },

    entities: [User, Item, Role, Collection],
    dbName: "pa_dev",
    user: "postgres",
    password: "postgres",
    port: 5432,
    debug: !__prod__,
    type: "postgresql",
} as Parameters<typeof MikroORM.init>[0];

export default microConfig;
