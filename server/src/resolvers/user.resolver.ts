import { EntityManager } from "@mikro-orm/postgresql";
import argon2 from "argon2";
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { COOKIE_NAME } from "../constants";
import { User } from "../entities/user.entity";
import { Context } from "../types";
import { createAcessToken } from "../utils/auth";
import { ErrorFieldHandler } from "../utils/errorFieldHandler";
import { isAuth } from "../utils/isAuth";
import { Role } from "./../entities/role.entity";
import { genericError } from "./../utils/generalAuxiliaryMethods";

@InputType()
class UserBasicData {
    @Field()
    name: string;
    @Field()
    password: string;
    @Field()
    email: string;
    @Field()
    role_id: string;
}

@InputType()
class userSeetingsInput {
    @Field()
    id: string;

    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => String, { nullable: true })
    email: string;

    @Field(() => String, { nullable: true })
    password?: string;

    @Field(() => String, { nullable: true })
    role_id: string;

    @Field(() => Boolean, { nullable: true })
    active?: boolean;
}

@ObjectType()
class tokenAndId {
    @Field(() => String, { nullable: true })
    accessToken?: string;

    @Field(() => String, { nullable: true })
    userId?: string;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => String, { nullable: true })
    userRoleCode: string;
}

@ObjectType()
class LoginResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => tokenAndId, { nullable: true })
    result?: tokenAndId;
}

@ObjectType()
class UserResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => User, { nullable: true })
    user?: User;
    keys?: null;
}

@ObjectType()
class UsersResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => [User], { nullable: true })
    users?: User[];
    @Field()
    total?: Number;
}

@ObjectType()
class RevokeResponse {
    @Field(() => Boolean)
    incrementado: true | false;
    @Field(() => Int, { nullable: true })
    version: number;
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "Hello";
    }
    // altera a versão do token inpossibilitando
    // novo acesso se a versão for diferente
    // usado quando o usuário esqueceu a senha
    @Mutation(() => RevokeResponse)
    async revokeRefreshTokensForUser(
        @Arg("userId") userId: string,
        @Ctx() { em }: Context
    ): Promise<RevokeResponse> {
        const user = await em.findOne(User, { id: userId });
        const result: RevokeResponse = {
            version: 0,
            incrementado: false,
        };
        try {
            if (user) {
                user.tokenVersion = user.tokenVersion + 1;
                result.version = user.tokenVersion;
                result.incrementado = true;
                await em.persistAndFlush(user);
            } else {
                result.version = 0;
                result.incrementado = false;
            }
        } catch (_) {
            result.version = 0;
            result.incrementado = false;
        }

        return result;
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    logedInTest(@Ctx() { payload }: Context) {
        return `Hi, yout id is : ${payload!.userId}`;
    }

    @Query(() => UsersResponse)
    async getAllUsers(
        @Arg("active") active: boolean,
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Ctx() { em }: Context
    ): Promise<UsersResponse> {
        const max = Math.min(10, limit);

        const qb = (em as EntityManager).createQueryBuilder(User, "u");
        qb.select(["u.*"])
            .where({ active: active })
            .limit(max)
            .orderBy({ name: "ASC" });

        try {
            const users: User[] = await qb.getResult();

            await em.populate(users, ["role"]);

            const result = { users: users, total: users.length };

            return result;
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getAllUsers",
                    __filename,
                    `message: ${e.message}`
                ),
            };
        }
    }

    @Query(() => UserResponse)
    async getUserById(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        const user = await em.getRepository(User).findOne({ id });
        if (!user) {
            return {
                errors: [
                    {
                        field: "id",
                        message: "User not Fount",
                        method: `Method: login, at ${__filename}`,
                    },
                ],
            };
        }

        return { user };
    }

    @Query(() => UserResponse)
    async getUserSettings(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        const user = await em.getRepository(User).findOne({ id });
        if (!user) {
            return {
                errors: [
                    {
                        field: "id",
                        message: "User not Fount",
                        method: `Method: login, at ${__filename}`,
                    },
                ],
            };
        }

        return { user };
    }

    @Mutation(() => UserResponse)
    async createUser(
        @Arg("options") options: UserBasicData,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        if (options.name.length <= 2) {
            return {
                errors: [
                    {
                        field: "username",
                        message:
                            "A username must have length greater than 2 charachters.",
                        method: `Method: createUser, at ${__filename}`,
                    },
                ],
            };
        }
        if (options.password.length <= 3) {
            return {
                errors: [
                    {
                        field: "password",
                        message:
                            "A user password must have length greater than 3 charachters.",
                        method: `Method: createUser, at ${__filename}`,
                    },
                ],
            };
        }
        const hashedPassword = await argon2.hash(options.password);
        options.password = hashedPassword;

        const role = await em.findOne(Role, {
            id: options.role_id,
        });

        if (!role) {
            return {
                errors: [
                    {
                        field: "role_id",
                        message: "Could not find role, from role_id provided.",
                        method: `Method: createUser, at ${__filename}`,
                    },
                ],
            };
        }
        /*
            name: options.name,
            hashedPassword: options.password,
            role: role,
            email: options.email
        */
        const user = em.create(User, {
            name: options.name,
            password: options.password,
            role_id: options.role_id,
            email: options.email,
        });

        user.role = role;

        await em.persistAndFlush(user);

        return { user };
    }

    @Mutation(() => Boolean!, { nullable: true })
    async logout(@Ctx() { res }: Context): Promise<void> {
        if (typeof window !== "undefined") {
            localStorage.clear();
        }
        res.clearCookie(COOKIE_NAME);
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email", () => String!) email: string,
        @Arg("password", () => String!) password: string,
        @Ctx() { em }: Context
    ): Promise<LoginResponse> {
        if (!email || !password) {
            let errors: ErrorFieldHandler[] | undefined = [];

            if (!email) {
                errors = [
                    {
                        field: "email",
                        message: "Email is required",
                        method: `Method: login, at ${__filename}`,
                    },
                ];
            }

            if (!password) {
                errors.push({
                    field: "password",
                    message: "Password is required",
                    method: `Method: login, at ${__filename}`,
                });
            }

            return {
                errors,
            };
        }

        const user = await em.findOne(User, { email: email });

        if (!user) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "Email not found",
                        method: `Method: login, at ${__filename}`,
                    },
                ],
            };
        }

        const validPass = await argon2.verify(user.password, password);

        if (!validPass) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password",
                        method: `Method: login, at ${__filename}`,
                    },
                ],
            };
        }

        const result: tokenAndId = {
            accessToken: createAcessToken(user),
            userId: user.id,
            userRoleCode: user.role.code,
        };

        return {
            result,
        };
    }

    // userSeetingsInput
    @Mutation(() => UserResponse)
    async updateSeetingsUser(
        @Arg("options") options: userSeetingsInput,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { id: options.id });

        if (!user) {
            return {
                errors: [
                    {
                        field: "id",
                        message: `Could not found user with id: ${options.id}`,
                        method: `Method: updateSeetingsUser, at ${__filename}`,
                    },
                ],
            };
        }

        if (
            options.email.toLocaleLowerCase().replace(/ /g, "") !==
            user.email.toLocaleLowerCase().replace(/ /g, "")
        ) {
            const userEmail = await em.findOne(User, { email: options.email });

            if (userEmail) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: `Email ${options.email} already takken.`,
                            method: `Method: updateSeetingsUser, at ${__filename}`,
                        },
                    ],
                };
            }
        }

        const role = await em.findOne(Role, { id: options.role_id });

        if (!role) {
            return {
                errors: [
                    {
                        field: "role_id",
                        message: `Could not found role with id: ${options.role_id}`,
                        method: `Method: updateSeetingsUser, at ${__filename}`,
                    },
                ],
            };
        }

        if (options.password) {
            if (options.password.length <= 3) {
                return {
                    errors: [
                        {
                            field: "password",
                            message:
                                "A user password must have length greater than 3 charachters.",
                            method: `Method: updateSeetingsUser, at ${__filename}`,
                        },
                    ],
                };
            }

            const hashedPassword = await argon2.hash(options.password);
            options.password = hashedPassword;
            user.password = options.password;
        }

        user.name = options.name;
        user.email = options.email;
        user.role = role;

        try {
            await em.persistAndFlush(user);
        } catch (e) {
            return {
                errors: [
                    {
                        field: "-",
                        message: `${e.message}`,
                        method: `Method: updateSeetingsUser, at ${__filename}`,
                    },
                ],
            };
        }

        return { user };
    }
}
