import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
    Int,
} from "type-graphql";
import { User } from "./../entities/User";
import argon2 from "argon2";
import { createAcessToken, createRefreshToken } from "../utils/auth";
import { isAuth } from "./../utils/isAuth";
import { sendRefreshToken } from "./../utils/sendRefreshToken";
import { Context } from "src/types";

@InputType()
class UserBasicData {
    @Field()
    name: string;
    @Field()
    password: string;
    @Field()
    email: string;
}
/**
 *  @field: field that originated the error
 *  @message: message describing the error and cause
 *  @method: method in which the error occurred
 *
 */
@ObjectType()
class ErrorFieldHandler {
    @Field()
    field: string;

    @Field()
    message: string;

    @Field()
    method: string;
}

@ObjectType()
class LoginResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => String, { nullable: true })
    accessToken?: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => User, { nullable: true })
    user?: User;
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
        @Arg("userId", () => Int) userId: number,
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
        const user = em.create(User, options);
        await em.persistAndFlush(user);

        return { user };
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email", () => String!) email: string,
        @Arg("password", () => String!) password: string,
        @Ctx() { em, res }: Context
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
        localStorage.setItem("currentUserId", `${user.id}`);
        //localStorage.clear();
        //localStorage.removeItem("mykey");
        //localStorage.getItem("mykey");
        sendRefreshToken(res, createRefreshToken(user));

        return {
            accessToken: createAcessToken(user),
        };
    }
}
