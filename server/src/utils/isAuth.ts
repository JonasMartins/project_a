import { MiddlewareFn } from "type-graphql";
import { Context } from "./../types";
import { verify } from "jsonwebtoken";

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
    const authorization = context.req.headers["authorization"];
    if (!authorization) {
        //throw new Error("Authentication error");
        return next();
    }
    try {
        const token = authorization.split(" ")[0];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        context.payload = payload as any;
    } catch (e) {
        //throw new Error("Authentication error: " + e.message);
        // return null;
        return next();
    }

    return next();
};
