import { User } from "./../entities/User";
import { MyContext } from "./../types";
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
} from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../constants";
@InputType()
class UsernamePasswordInfo {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() { req, em }: MyContext) {
        if (!req.session.userId) {
            return null;
        }
        const user = await em.findOne(User, { id: req.session.userId });

        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInfo,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: "username",
                        message:
                            "A username must have length greater than 2 charachters.",
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
                    },
                ],
            };
        }

        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            const result = await (em as EntityManager)
                .createQueryBuilder(User)
                .getKnexQuery()
                .insert({
                    username: options.username,
                    password: hashedPassword,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
                .returning("*");
            user = result[0];
        } catch (err) {
            if (err.code == "23505") {
                // duplicate userName error,
                // how to know ?  console.log("message: ", err);
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username informed already exists.",
                        },
                    ],
                };
            }
        }

        req.session!.userId = user.id;

        return {
            user,
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UsernamePasswordInfo,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });

        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "That username doesn't exist.",
                    },
                ],
            };
        }

        const validPass = await argon2.verify(user.password, options.password);

        if (!validPass) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password",
                    },
                ],
            };
        }

        req.session!.userId = user.id;

        return {
            user,
        };
    }

    @Query(() => User, { nullable: true })
    getUserById(
        @Arg("id", () => Int) id: number,
        @Ctx() { em }: MyContext
    ): Promise<User | null> {
        return em.findOneOrFail(User, { id });
    }

    @Query(() => User, { nullable: true })
    getUserByName(
        @Arg("name", () => String) name: string,
        @Ctx() { em }: MyContext
    ): Promise<User | null> {
        return em.findOneOrFail(User, { username: name });
    }

    @Query(() => [User], { nullable: true })
    getAllUsers(@Ctx() { em }: MyContext): Promise<User[]> {
        return em.find(User, {});
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
        return new Promise((resolve) =>
            req.session.destroy((err) => {
                if (err) {
                    resolve(false);
                    return;
                }
                res.clearCookie(COOKIE_NAME);
                resolve(true);
            })
        );
    }

    @Mutation(() => Boolean)
    async deleteAllUsers(@Ctx() { em }: MyContext): Promise<boolean> {
        const result = await em.nativeDelete(User, {});
        return !!result;
    }
}