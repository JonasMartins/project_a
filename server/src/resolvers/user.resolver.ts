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
import { createAcessToken, authUserResponse } from "../utils/auth";
import { ErrorFieldHandler } from "../utils/errorFieldHandler";
import { isAuth } from "../utils/isAuth";
import { Role } from "./../entities/role.entity";
import {
    genericError,
    validateEmail,
} from "./../utils/generalAuxiliaryMethods";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { manageUploadFile } from "./../utils/helpers/uploader.helper";

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

@ObjectType()
class UserSelect {
    @Field(() => String)
    label: string;

    @Field(() => String)
    value: string;
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

    @Query(() => authUserResponse)
    @UseMiddleware(isAuth)
    logedInTest(@Ctx() { payload }: Context): authUserResponse {
        if (!payload?.userId) {
            return {
                errors: genericError(
                    "-",
                    "logedInTest",
                    __filename,
                    "Not Authenticated"
                ),
            };
        }

        let result = JSON.stringify(payload);

        return { result };
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
        if (!validateEmail(options.email)) {
            return {
                errors: [
                    {
                        field: "email",
                        message: `Email ${options.email} wrong email format.`,
                        method: `Method: createUser, at ${__filename}`,
                    },
                ],
            };
        }

        const userEmail = await em.findOne(User, { email: options.email });

        if (userEmail) {
            return {
                errors: [
                    {
                        field: "email",
                        message: `Email ${options.email} already takken.`,
                        method: `Method: createUser, at ${__filename}`,
                    },
                ],
            };
        }

        if (options.name.length <= 2) {
            return {
                errors: [
                    {
                        field: "name",
                        message: "A user name must have length greater than 2.",
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
                            "A user password must have length greater than 3.",
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

    @Query(() => [UserSelect])
    async getUsersSelect(
        @Arg("active") active: boolean,
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Ctx() { em }: Context
    ): Promise<UserSelect[]> {
        const max = Math.min(50, limit);
        const qb = (em as EntityManager).createQueryBuilder(User, "u");
        qb.select(["u.*"])
            .where({ active: active })
            .limit(max)
            .orderBy({ name: "ASC" });

        let result: UserSelect[] = [];

        try {
            const users: User[] = await qb.getResult();

            users.forEach((user) => {
                result.push({
                    label: user.name,
                    value: user.id,
                });
            });
            return result;
        } catch (e) {
            throw new Error(e.messaege);
        }
    }

    // userSeetingsInput
    @Mutation(() => UserResponse)
    async updateSeetingsUser(
        @Arg("id", () => String) id: string,
        @Arg("name", () => String, { nullable: true }) name: string,
        @Arg("email", () => String, { nullable: true }) email: string,
        @Arg("password", () => String, { nullable: true }) password: string,
        @Arg("role_id", () => String, { nullable: true }) role_id: string,
        @Arg("active", () => Boolean, { nullable: true }) active: boolean,
        @Arg("file", () => GraphQLUpload, { nullable: true }) file: FileUpload,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        if (name.length <= 2) {
            return {
                errors: [
                    {
                        field: "name",
                        message: "A user name must have length greater than 2.",
                        method: `Method: updateSeetingsUser, at ${__filename}`,
                    },
                ],
            };
        }
        if (password && password.length <= 3) {
            return {
                errors: [
                    {
                        field: "password",
                        message:
                            "A user password must have length greater than 3.",
                        method: `Method: updateSeetingsUser, at ${__filename}`,
                    },
                ],
            };
        }

        if (!validateEmail(email)) {
            return {
                errors: [
                    {
                        field: "email",
                        message: `Email ${email} wrong email format.`,
                        method: `Method: updateSeetingsUser, at ${__filename}`,
                    },
                ],
            };
        }

        const user = await em.findOne(User, { id });

        if (!user) {
            return {
                errors: [
                    {
                        field: "id",
                        message: `Could not found user with id: ${id}`,
                        method: `Method: updateSeetingsUser, at ${__filename}`,
                    },
                ],
            };
        }

        user.active = active;

        if (
            email.toLocaleLowerCase().replace(/ /g, "") !==
            user.email.toLocaleLowerCase().replace(/ /g, "")
        ) {
            const userEmail = await em.findOne(User, { email: email });

            if (userEmail) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: `Email ${email} already takken.`,
                            method: `Method: updateSeetingsUser, at ${__filename}`,
                        },
                    ],
                };
            }
        }

        const role = await em.findOne(Role, { id: role_id });

        if (!role) {
            return {
                errors: [
                    {
                        field: "role_id",
                        message: `Could not found role with id: ${role_id}`,
                        method: `Method: updateSeetingsUser, at ${__filename}`,
                    },
                ],
            };
        }

        if (password) {
            if (password.length <= 3) {
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

            const hashedPassword = await argon2.hash(password);
            password = hashedPassword;
            user.password = password;
        }

        user.name = name;
        user.email = email;
        user.role = role;

        if (file) {
            let result = await manageUploadFile(
                file,
                "file",
                "getUniqueFolderName",
                __filename
            );

            // throw an error if the file could note been uploaded
            if (result.path) {
                user.picture = result.path;
            }
        }

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
