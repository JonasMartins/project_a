import { Response } from "express";
import { COOKIE_NAME } from "./../utils/cons";

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
    });
};
