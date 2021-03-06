import { User } from "../entities/user.entity";
import { sign } from "jsonwebtoken";
import { Field, ObjectType } from "type-graphql";
import { ErrorFieldHandler } from "./errorFieldHandler";

export const createAcessToken = (user: User) => {
    return sign(
        {
            userId: user.id,
            role: user.role.name,
            name: user.name,
            picture: user.picture,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "2d",
        }
    );
};

export const createRefreshToken = (user: User) => {
    return sign(
        { userId: user.id, tokenVersion: user.tokenVersion },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "3d",
        }
    );
};

@ObjectType()
export class authUserResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => String, { nullable: true })
    result?: string;
}
