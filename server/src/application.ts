import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import { Server } from "http";
import { verify } from "jsonwebtoken";
import { buildSchema } from "type-graphql";
import { User } from "./entities/user.entity";
import microConfig from "./mikro-orm.config";
import { ItemResolver } from "./resolvers/item.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import { RoleResolver } from "./resolvers/role.resolver";
import { TeamResolver } from "./resolvers/team.resolvers";
import { AppointmentResolver } from "./resolvers/appointment.resolver";
import { SprintResolver } from "./resolvers/sprint.resolver";
import { ProjectResolver } from "./resolvers/project.resolver";
import { Context } from "./types";
import { createAcessToken, createRefreshToken } from "./utils/auth";
import { COOKIE_NAME } from "./utils/cons";
import { sendRefreshToken } from "./utils/sendRefreshToken";
import { graphqlUploadExpress } from "graphql-upload";
import path from "path/posix";

type failedRefresh = {
    ok: boolean;
    accessToken: string;
};

export default class Application {
    public orm: MikroORM<IDatabaseDriver<Connection>>;
    public app: express.Application;
    public server: Server;

    public connect = async (): Promise<void> => {
        try {
            this.orm = await MikroORM.init(microConfig);
        } catch (e) {
            console.error("Erro connecting to database", e);
            throw Error(e);
        }
    };

    public init = async (): Promise<void> => {
        this.app = express();

        this.app.use(cookieParser());

        this.app.use(
            cors({
                origin: process.env.DEV_FRONT_URL,
                credentials: true,
            })
        );

        this.app.post("/refresh_token", async (req, res) => {
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
            const user = await this.orm.em.findOne(User, {
                id: payload.userId,
            });

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
                resolvers: [
                    UserResolver,
                    RoleResolver,
                    ItemResolver,
                    TeamResolver,
                    SprintResolver,
                    ProjectResolver,
                    AppointmentResolver,
                ],
                validate: false,
            }),
            // special object accesible for all resolvers
            context: ({ req, res }): Context => ({ em: this.orm.em, req, res }),
            introspection: true,
            uploads: false,
        });

        this.app.use(
            graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 2 })
        );

        this.app.use("/images", express.static("images"));

        apolloServer.applyMiddleware({
            app: this.app,
            cors: false,
        });

        this.server = this.app.listen(4001, () => {
            console.log("The application is listening on port 4001!");
        });
    };
}
