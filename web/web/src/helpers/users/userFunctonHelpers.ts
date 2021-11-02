import { User, Role, Maybe } from "./../../generated/graphql";

export type userManageInfo = {
    user?: Maybe<
        { __typename?: "User" } & Pick<
            User,
            "id" | "name" | "email" | "active" | "picture"
        > & { role: { __typename?: "Role" } & Pick<Role, "id" | "name"> }
    >;
};

export const generateRandomPassword = (length: number): string => {
    let password = "";
    let charIndex = 0;
    let charachters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 0; i < length; i++) {
        charIndex = Math.floor(Math.random() * charachters.length + 1);
        password += charachters.charAt(charIndex);
    }

    return password;
};
