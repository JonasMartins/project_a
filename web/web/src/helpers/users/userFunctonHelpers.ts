import { User, Role, Maybe } from "./../../generated/graphql";

export type userManageInfo = {
    user?: Maybe<
        { __typename?: "User" } & Pick<
            User,
            "id" | "name" | "email" | "active" | "picture"
        > & { role: { __typename?: "Role" } & Pick<Role, "id" | "name"> }
    >;
};
