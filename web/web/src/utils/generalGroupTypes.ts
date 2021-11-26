import { string } from "prop-types";
import { Sprint, Project, Team, Role, User } from "./../generated/graphql";

export type generalContext = "create" | "update" | "view";
export type simpleContext = "create" | "update";

export type projectSprintType = {
    project: {
        __typename?: "Project";
    } & Pick<Project, "id" | "name">;
};

export type sprintType = {
    sprint: {
        __typename?: "Sprint";
    } & Pick<
        Sprint,
        "id" | "description" | "code" | "length" | "final" | "active"
    > & {
            project: {
                __typename?: "Project";
            } & Pick<Project, "id" | "name">;
        };
};

export type membersGetTeamsType = Array<
    { __typename?: "User" } & Pick<User, "id" | "name" | "picture"> & {
            role: { __typename?: "Role" } & Pick<Role, "name">;
        }
>;

export type singleMemberGetTeamsType = { __typename?: "User" } & Pick<
    User,
    "id" | "name" | "picture"
> & {
        role: { __typename?: "Role" } & Pick<Role, "name">;
    };

export type singleUserGetAllUsers = {
    __typename?: "User";
} & Pick<User, "id" | "name" | "picture" | "active" | "email"> & {
        role: {
            __typename?: "Role";
        } & Pick<Role, "id" | "name">;
    };

export type teamGetTeamsType = { __typename?: "Team" } & Pick<
    Team,
    "id" | "name" | "description"
> & {
        leader: { __typename?: "User" } & Pick<
            User,
            "id" | "name" | "picture"
        > & {
                role: { __typename?: "Role" } & Pick<Role, "name">;
            };
        members: Array<
            { __typename?: "User" } & Pick<User, "id" | "name" | "picture"> & {
                    role: { __typename?: "Role" } & Pick<Role, "name">;
                }
        >;
    };

export type projectType = {
    project: { __typename?: "Project" } & Pick<
        Project,
        "id" | "name" | "createdAt" | "description"
    >;
};

export interface projectInfo {
    id: string;
    name: string;
    description: string;
}
export interface customProjectErrors {
    name: string | null;
    description: string | null;
}

export interface customSprintErrors {
    code: string | null;
    project_id: string | null;
    description: string | null;
}

export interface customTeamErrors {
    id: string | null;
    name: string | null;
    description: string | null;
    leader_id: string | null;
}

export interface defaultSelectPattern {
    value: string;
    label: string;
}
