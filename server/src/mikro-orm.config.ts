import { __prod__ } from "./constants";
import { Collection, MikroORM } from "@mikro-orm/core";
import path from "path";
import { Item } from "./entities/item.entity";
import { User } from "./entities/user.entity";
import { Role } from "./entities/role.entity";
import { Team } from "./entities/team.entity";
import { Sprint } from "./entities/sprint.entity";
import { Project } from "./entities/project.entity";
import { Appointment } from "./entities/appointment.entity";

const microConfig = {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },

    entities: [
        User,
        Item,
        Role,
        Team,
        Collection,
        Sprint,
        Project,
        Appointment,
    ],
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432,
    debug: !__prod__,
    type: "postgresql",
} as Parameters<typeof MikroORM.init>[0];

export default microConfig;
