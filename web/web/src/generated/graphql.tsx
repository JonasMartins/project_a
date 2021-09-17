import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
    { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
    { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
    DateTime: any;
};

export type ErrorFieldHandler = {
    __typename?: "ErrorFieldHandler";
    field: Scalars["String"];
    message: Scalars["String"];
    method: Scalars["String"];
};

export type Item = {
    __typename?: "Item";
    id: Scalars["ID"];
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
    summary: Scalars["String"];
    description: Scalars["String"];
    reporter: User;
    responsible: User;
    approver: User;
    status: ItemStatus;
    type: ItemType;
    priority: ItemPriority;
    responsible_id: Scalars["String"];
    reporter_id: Scalars["String"];
    approver_id: Scalars["String"];
    sprint: Sprint;
};

/** The basic directions */
export enum ItemPriority {
    Highest = "HIGHEST",
    High = "HIGH",
    Medium = "MEDIUM",
    Low = "LOW",
    Lowest = "LOWEST",
}

export type ItemResponse = {
    __typename?: "ItemResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    item?: Maybe<Item>;
};

/** The basic directions */
export enum ItemStatus {
    Open = "OPEN",
    InProgress = "IN_PROGRESS",
    Reopened = "REOPENED",
    Resolved = "RESOLVED",
    Closed = "CLOSED",
    Completed = "COMPLETED",
}

/** The basic directions */
export enum ItemType {
    Bug = "BUG",
    Task = "TASK",
    Story = "STORY",
}

export type ItemValidator = {
    summary: Scalars["String"];
    description: Scalars["String"];
    status: ItemStatus;
    type: ItemType;
    priority: ItemPriority;
};

export type ItensResponse = {
    __typename?: "ItensResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    itens?: Maybe<Array<Item>>;
};

export type LoginResponse = {
    __typename?: "LoginResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    result?: Maybe<TokenAndId>;
};

export type Mutation = {
    __typename?: "Mutation";
    createItem: ItemResponse;
    revokeRefreshTokensForUser: RevokeResponse;
    createUser: UserResponse;
    logout?: Maybe<Scalars["Boolean"]>;
    login: LoginResponse;
    createRole: RoleRespnse;
    createTeam: TeamResponse;
    createSprint: SprintResponse;
    createProject: ProjectResponse;
};

export type MutationCreateItemArgs = {
    approverId: Scalars["String"];
    responsibleId: Scalars["String"];
    reporterId: Scalars["String"];
    options: ItemValidator;
};

export type MutationRevokeRefreshTokensForUserArgs = {
    userId: Scalars["String"];
};

export type MutationCreateUserArgs = {
    options: UserBasicData;
};

export type MutationLoginArgs = {
    password: Scalars["String"];
    email: Scalars["String"];
};

export type MutationCreateRoleArgs = {
    options: RoleValidator;
};

export type MutationCreateTeamArgs = {
    options: TeamValidator;
};

export type MutationCreateSprintArgs = {
    options: SprintValidator;
};

export type MutationCreateProjectArgs = {
    options: ProjectValidator;
};

export type Project = {
    __typename?: "Project";
    id: Scalars["ID"];
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
    name: Scalars["String"];
    description: Scalars["String"];
    sprints: Array<Sprint>;
};

export type ProjectResponse = {
    __typename?: "ProjectResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    project?: Maybe<Project>;
};

export type ProjectValidator = {
    name: Scalars["String"];
    description: Scalars["String"];
};

export type Query = {
    __typename?: "Query";
    getItensRelatedToUserByPeriod: ItensResponse;
    getItemById: ItemResponse;
    hello: Scalars["String"];
    logedInTest: Scalars["String"];
    getUserById: UserResponse;
    getRoleById: RoleRespnse;
    getTeamById: TeamResponse;
    getProjects?: Maybe<Array<Project>>;
    getProjectById: ProjectResponse;
};

export type QueryGetItensRelatedToUserByPeriodArgs = {
    createdLater?: Maybe<Scalars["DateTime"]>;
    createdAfter?: Maybe<Scalars["DateTime"]>;
    limit?: Maybe<Scalars["Float"]>;
    userId: Scalars["String"];
};

export type QueryGetItemByIdArgs = {
    id: Scalars["String"];
};

export type QueryGetUserByIdArgs = {
    id: Scalars["String"];
};

export type QueryGetRoleByIdArgs = {
    id: Scalars["String"];
};

export type QueryGetTeamByIdArgs = {
    id: Scalars["String"];
};

export type QueryGetProjectsArgs = {
    limit?: Maybe<Scalars["Float"]>;
};

export type QueryGetProjectByIdArgs = {
    id: Scalars["String"];
};

export type RevokeResponse = {
    __typename?: "RevokeResponse";
    incrementado: Scalars["Boolean"];
    version?: Maybe<Scalars["Int"]>;
};

export type Role = {
    __typename?: "Role";
    id: Scalars["ID"];
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
    name: Scalars["String"];
    code: Scalars["String"];
    description: Scalars["String"];
    wage: Scalars["Float"];
    professionals: Array<User>;
};

export type RoleRespnse = {
    __typename?: "RoleRespnse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    role?: Maybe<Role>;
};

export type RoleValidator = {
    name: Scalars["String"];
    code: Scalars["String"];
    description: Scalars["String"];
    wage: Scalars["Float"];
};

export type Sprint = {
    __typename?: "Sprint";
    id: Scalars["ID"];
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
    code: Scalars["String"];
    description: Scalars["String"];
    length: SprintLength;
    final: Scalars["DateTime"];
    itens: Array<Item>;
    project: Project;
    active: Scalars["Boolean"];
};

/** The basic directions */
export enum SprintLength {
    One = "ONE",
    Two = "TWO",
    Three = "THREE",
    Four = "FOUR",
}

export type SprintResponse = {
    __typename?: "SprintResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    sprint?: Maybe<Sprint>;
};

export type SprintValidator = {
    code: Scalars["String"];
    description: Scalars["String"];
    length: SprintLength;
    project_id: Scalars["String"];
};

export type Team = {
    __typename?: "Team";
    id: Scalars["ID"];
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
    name: Scalars["String"];
    description: Scalars["String"];
    leader: User;
    leader_id: Scalars["String"];
    members: Array<User>;
};

export type TeamResponse = {
    __typename?: "TeamResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    team?: Maybe<Team>;
};

export type TeamValidator = {
    name: Scalars["String"];
    description: Scalars["String"];
    leader_id: Scalars["String"];
};

export type User = {
    __typename?: "User";
    id: Scalars["ID"];
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
    name: Scalars["String"];
    email: Scalars["String"];
    itenReporter: Array<Item>;
    itenResponsible: Array<Item>;
    itenApprover: Array<Item>;
    teams: Array<Team>;
    role: Role;
};

export type UserBasicData = {
    name: Scalars["String"];
    password: Scalars["String"];
    email: Scalars["String"];
    role_id: Scalars["String"];
};

export type UserResponse = {
    __typename?: "UserResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    user?: Maybe<User>;
};

export type TokenAndId = {
    __typename?: "tokenAndId";
    accessToken?: Maybe<Scalars["String"]>;
    userId?: Maybe<Scalars["String"]>;
};

export type CreateItemMutationVariables = Exact<{
    approverId: Scalars["String"];
    responsibleId: Scalars["String"];
    reporterId: Scalars["String"];
    options: ItemValidator;
}>;

export type CreateItemMutation = { __typename?: "Mutation" } & {
    createItem: { __typename?: "ItemResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "method" | "message"
                >
            >
        >;
        item?: Maybe<
            { __typename?: "Item" } & Pick<Item, "id" | "summary"> & {
                    responsible: { __typename?: "User" } & Pick<
                        User,
                        "id" | "name" | "email"
                    >;
                    approver: { __typename?: "User" } & Pick<
                        User,
                        "id" | "name" | "email"
                    >;
                    reporter: { __typename?: "User" } & Pick<
                        User,
                        "id" | "name" | "email"
                    >;
                }
        >;
    };
};

export type LoginMutationVariables = Exact<{
    email: Scalars["String"];
    password: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
    login: { __typename?: "LoginResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "field" | "method" | "message"
                >
            >
        >;
        result?: Maybe<
            { __typename?: "tokenAndId" } & Pick<
                TokenAndId,
                "accessToken" | "userId"
            >
        >;
    };
};

export type Unnamed_1_MutationVariables = Exact<{ [key: string]: never }>;

export type Unnamed_1_Mutation = { __typename?: "Mutation" } & Pick<
    Mutation,
    "logout"
>;

export type GetItemByIdQueryVariables = Exact<{
    id: Scalars["String"];
}>;

export type GetItemByIdQuery = { __typename?: "Query" } & {
    getItemById: { __typename?: "ItemResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "method" | "message"
                >
            >
        >;
        item?: Maybe<
            { __typename?: "Item" } & Pick<
                Item,
                "id" | "summary" | "description"
            > & {
                    responsible: { __typename?: "User" } & Pick<
                        User,
                        "id" | "name" | "email"
                    >;
                    approver: { __typename?: "User" } & Pick<
                        User,
                        "id" | "name" | "email"
                    >;
                }
        >;
    };
};

export type GetItensRelatedToUserByPeriodQueryVariables = Exact<{
    limit?: Maybe<Scalars["Float"]>;
    userId: Scalars["String"];
    createdAfter?: Maybe<Scalars["DateTime"]>;
    createdLater?: Maybe<Scalars["DateTime"]>;
}>;

export type GetItensRelatedToUserByPeriodQuery = { __typename?: "Query" } & {
    getItensRelatedToUserByPeriod: { __typename?: "ItensResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "message"
                >
            >
        >;
        itens?: Maybe<
            Array<
                { __typename?: "Item" } & Pick<
                    Item,
                    | "id"
                    | "summary"
                    | "description"
                    | "status"
                    | "type"
                    | "priority"
                    | "responsible_id"
                    | "reporter_id"
                    | "approver_id"
                >
            >
        >;
    };
};

export type GetProjectByIdQueryVariables = Exact<{
    id: Scalars["String"];
}>;

export type GetProjectByIdQuery = { __typename?: "Query" } & {
    getProjectById: { __typename?: "ProjectResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "message"
                >
            >
        >;
        project?: Maybe<
            { __typename?: "Project" } & Pick<
                Project,
                "id" | "name" | "description"
            > & {
                    sprints: Array<
                        { __typename?: "Sprint" } & Pick<
                            Sprint,
                            | "id"
                            | "code"
                            | "final"
                            | "length"
                            | "description"
                            | "active"
                        >
                    >;
                }
        >;
    };
};

export type GetProjectsQueryVariables = Exact<{
    limit?: Maybe<Scalars["Float"]>;
}>;

export type GetProjectsQuery = { __typename?: "Query" } & {
    getProjects?: Maybe<
        Array<
            { __typename?: "Project" } & Pick<
                Project,
                "id" | "name" | "createdAt" | "description"
            >
        >
    >;
};

export type GetUserByIdQueryVariables = Exact<{
    id: Scalars["String"];
}>;

export type GetUserByIdQuery = { __typename?: "Query" } & {
    getUserById: { __typename?: "UserResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "message" | "method"
                >
            >
        >;
        user?: Maybe<
            { __typename?: "User" } & Pick<User, "id" | "name" | "email"> & {
                    itenReporter: Array<
                        { __typename?: "Item" } & Pick<
                            Item,
                            "id" | "createdAt" | "updatedAt" | "status"
                        >
                    >;
                    itenApprover: Array<
                        { __typename?: "Item" } & Pick<
                            Item,
                            "id" | "createdAt" | "updatedAt" | "status"
                        >
                    >;
                    itenResponsible: Array<
                        { __typename?: "Item" } & Pick<
                            Item,
                            "id" | "createdAt" | "updatedAt" | "status"
                        >
                    >;
                }
        >;
    };
};

export const CreateItemDocument = gql`
    mutation CreateItem(
        $approverId: String!
        $responsibleId: String!
        $reporterId: String!
        $options: ItemValidator!
    ) {
        createItem(
            approverId: $approverId
            responsibleId: $responsibleId
            reporterId: $reporterId
            options: $options
        ) {
            errors {
                method
                message
            }
            item {
                id
                summary
                responsible {
                    id
                    name
                    email
                }
                approver {
                    id
                    name
                    email
                }
                reporter {
                    id
                    name
                    email
                }
            }
        }
    }
`;

export function useCreateItemMutation() {
    return Urql.useMutation<CreateItemMutation, CreateItemMutationVariables>(
        CreateItemDocument
    );
}
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            errors {
                field
                method
                message
            }
            result {
                accessToken
                userId
            }
        }
    }
`;

export function useLoginMutation() {
    return Urql.useMutation<LoginMutation, LoginMutationVariables>(
        LoginDocument
    );
}
export const Document = gql`
    mutation {
        logout
    }
`;

export function useMutation() {
    return Urql.useMutation<Mutation, MutationVariables>(Document);
}
export const GetItemByIdDocument = gql`
    query GetItemById($id: String!) {
        getItemById(id: $id) {
            errors {
                method
                message
            }
            item {
                id
                summary
                description
                responsible {
                    id
                    name
                    email
                }
                approver {
                    id
                    name
                    email
                }
            }
        }
    }
`;

export function useGetItemByIdQuery(
    options: Omit<Urql.UseQueryArgs<GetItemByIdQueryVariables>, "query"> = {}
) {
    return Urql.useQuery<GetItemByIdQuery>({
        query: GetItemByIdDocument,
        ...options,
    });
}
export const GetItensRelatedToUserByPeriodDocument = gql`
    query GetItensRelatedToUserByPeriod(
        $limit: Float
        $userId: String!
        $createdAfter: DateTime
        $createdLater: DateTime
    ) {
        getItensRelatedToUserByPeriod(
            limit: $limit
            userId: $userId
            createdAfter: $createdAfter
            createdLater: $createdLater
        ) {
            errors {
                message
            }
            itens {
                id
                summary
                description
                status
                type
                priority
                responsible_id
                reporter_id
                approver_id
            }
        }
    }
`;

export function useGetItensRelatedToUserByPeriodQuery(
    options: Omit<
        Urql.UseQueryArgs<GetItensRelatedToUserByPeriodQueryVariables>,
        "query"
    > = {}
) {
    return Urql.useQuery<GetItensRelatedToUserByPeriodQuery>({
        query: GetItensRelatedToUserByPeriodDocument,
        ...options,
    });
}
export const GetProjectByIdDocument = gql`
    query getProjectById($id: String!) {
        getProjectById(id: $id) {
            errors {
                message
            }
            project {
                id
                name
                description
                sprints {
                    id
                    code
                    final
                    length
                    description
                    active
                }
            }
        }
    }
`;

export function useGetProjectByIdQuery(
    options: Omit<Urql.UseQueryArgs<GetProjectByIdQueryVariables>, "query"> = {}
) {
    return Urql.useQuery<GetProjectByIdQuery>({
        query: GetProjectByIdDocument,
        ...options,
    });
}
export const GetProjectsDocument = gql`
    query getProjects($limit: Float) {
        getProjects(limit: $limit) {
            id
            name
            createdAt
            description
        }
    }
`;

export function useGetProjectsQuery(
    options: Omit<Urql.UseQueryArgs<GetProjectsQueryVariables>, "query"> = {}
) {
    return Urql.useQuery<GetProjectsQuery>({
        query: GetProjectsDocument,
        ...options,
    });
}
export const GetUserByIdDocument = gql`
    query GetUserById($id: String!) {
        getUserById(id: $id) {
            errors {
                message
                method
            }
            user {
                id
                name
                email
                itenReporter {
                    id
                    createdAt
                    updatedAt
                    status
                }
                itenApprover {
                    id
                    createdAt
                    updatedAt
                    status
                }
                itenResponsible {
                    id
                    createdAt
                    updatedAt
                    status
                }
            }
        }
    }
`;

export function useGetUserByIdQuery(
    options: Omit<Urql.UseQueryArgs<GetUserByIdQueryVariables>, "query"> = {}
) {
    return Urql.useQuery<GetUserByIdQuery>({
        query: GetUserByIdDocument,
        ...options,
    });
}
