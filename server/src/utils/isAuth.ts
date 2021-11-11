import { MiddlewareFn } from "type-graphql";
import { Context } from "./../types";
import { verify } from "jsonwebtoken";

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
    // console.log("on resolver ", context.req.headers);
    const authorization = context.req.headers["authorization"];

    const a = 1;

    if (!authorization) {
        throw new Error("Authentication error");
    }

    try {
        const token = authorization.split(" ")[0];
        console.log("token ", token);
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        context.payload = payload as any;
    } catch (e) {
        throw new Error("Authentication error: " + e.message);
    }

    return next();
};
