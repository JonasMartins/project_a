import { Sprint, Project } from "./../generated/graphql";

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
/*
sprint: {
    __typename?: "Sprint";
} & Pick<Sprint, "id" | "description" | "code" | "length" | "final" | "active"> & {
    project: {
        __typename?: "Project";
    } & Pick<Project, "id" | "name">;
}

*/

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
