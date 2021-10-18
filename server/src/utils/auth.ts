import { User } from "../entities/user.entity";
import { sign } from "jsonwebtoken";
export const createAcessToken = (user: User) => {
    return sign(
        { userId: user.id, role: user.role.name },
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
