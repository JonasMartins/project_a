import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
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
    /** The `Upload` scalar type represents a file upload. */
    Upload: any;
};

export type Appointment = {
    __typename?: "Appointment";
    id: Scalars["ID"];
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
    start: Scalars["DateTime"];
    end?: Maybe<Scalars["DateTime"]>;
    user: User;
    item: Item;
};

export type AppointmentResponse = {
    __typename?: "AppointmentResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    appointment?: Maybe<Appointment>;
};

export type AppointmentValidator = {
    start: Scalars["DateTime"];
    item_id: Scalars["String"];
    user_id: Scalars["String"];
};

export type AppointmentsResponse = {
    __typename?: "AppointmentsResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    appointments?: Maybe<Array<Appointment>>;
};

export type Comment = {
    __typename?: "Comment";
    id: Scalars["ID"];
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
    body: Scalars["String"];
    item: Item;
    author: User;
    order: Scalars["Float"];
    replies: Array<Comment>;
    parent?: Maybe<Comment>;
};

export type CommentResponse = {
    __typename?: "CommentResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    comment?: Maybe<Comment>;
};

export type CommentsResponse = {
    __typename?: "CommentsResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    comments?: Maybe<Array<Comment>>;
    total: Scalars["Float"];
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
    appointments: Array<Appointment>;
    comments?: Maybe<Array<Comment>>;
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
    sprint_id: Scalars["String"];
};

export type ItensResponse = {
    __typename?: "ItensResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    itens?: Maybe<Array<Item>>;
    total: Scalars["Float"];
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
    updateSeetingsUser: UserResponse;
    createRole: RoleRespnse;
    createTeam: TeamResponse;
    createAppointment: AppointmentResponse;
    createSprint: SprintResponse;
    createProject: ProjectResponse;
    createComment: CommentResponse;
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

export type MutationUpdateSeetingsUserArgs = {
    file?: Maybe<Scalars["Upload"]>;
    active?: Maybe<Scalars["Boolean"]>;
    role_id?: Maybe<Scalars["String"]>;
    password?: Maybe<Scalars["String"]>;
    email?: Maybe<Scalars["String"]>;
    name?: Maybe<Scalars["String"]>;
    id: Scalars["String"];
};

export type MutationCreateRoleArgs = {
    options: RoleValidator;
};

export type MutationCreateTeamArgs = {
    options: TeamValidator;
};

export type MutationCreateAppointmentArgs = {
    options: AppointmentValidator;
};

export type MutationCreateSprintArgs = {
    options: SprintValidator;
};

export type MutationCreateProjectArgs = {
    options: ProjectValidator;
};

export type MutationCreateCommentArgs = {
    order?: Maybe<Scalars["Float"]>;
    parentId?: Maybe<Scalars["String"]>;
    authorId: Scalars["String"];
    itemId: Scalars["String"];
    body: Scalars["String"];
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
    getItensBacklog: ItensResponse;
    hello: Scalars["String"];
    logedInTest: Scalars["String"];
    getAllUsers: UsersResponse;
    getUserById: UserResponse;
    getUserSettings: UserResponse;
    getRoleById: RoleRespnse;
    getAllRoles: RolesRespnse;
    getTeamById: TeamResponse;
    getAppointmentsByItem: AppointmentsResponse;
    getAppointmentsByUser: AppointmentsResponse;
    getSprints?: Maybe<Array<Sprint>>;
    getSprintById: SprintResponse;
    getProjects?: Maybe<Array<Project>>;
    getProjectById: ProjectResponse;
    getCommentById: CommentResponse;
    getCommentsByItem: CommentsResponse;
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

export type QueryGetItensBacklogArgs = {
    offset?: Maybe<Scalars["Float"]>;
    limit?: Maybe<Scalars["Float"]>;
};

export type QueryGetAllUsersArgs = {
    limit?: Maybe<Scalars["Float"]>;
    active: Scalars["Boolean"];
};

export type QueryGetUserByIdArgs = {
    id: Scalars["String"];
};

export type QueryGetUserSettingsArgs = {
    id: Scalars["String"];
};

export type QueryGetRoleByIdArgs = {
    id: Scalars["String"];
};

export type QueryGetTeamByIdArgs = {
    id: Scalars["String"];
};

export type QueryGetAppointmentsByItemArgs = {
    limit?: Maybe<Scalars["Float"]>;
    itemId: Scalars["String"];
};

export type QueryGetAppointmentsByUserArgs = {
    limit?: Maybe<Scalars["Float"]>;
    userId: Scalars["String"];
};

export type QueryGetSprintsArgs = {
    active?: Maybe<Scalars["Boolean"]>;
    limit?: Maybe<Scalars["Float"]>;
};

export type QueryGetSprintByIdArgs = {
    id: Scalars["String"];
};

export type QueryGetProjectsArgs = {
    limit?: Maybe<Scalars["Float"]>;
};

export type QueryGetProjectByIdArgs = {
    id: Scalars["String"];
};

export type QueryGetCommentByIdArgs = {
    id: Scalars["String"];
};

export type QueryGetCommentsByItemArgs = {
    itemId: Scalars["String"];
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

export type RolesRespnse = {
    __typename?: "RolesRespnse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    roles?: Maybe<Array<Role>>;
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
    password: Scalars["String"];
    itenReporter: Array<Item>;
    itenResponsible: Array<Item>;
    itenApprover: Array<Item>;
    teams: Array<Team>;
    role: Role;
    appointments: Array<Appointment>;
    comments?: Maybe<Array<Comment>>;
    picture?: Maybe<Scalars["String"]>;
    active: Scalars["Boolean"];
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

export type UsersResponse = {
    __typename?: "UsersResponse";
    errors?: Maybe<Array<ErrorFieldHandler>>;
    users?: Maybe<Array<User>>;
    total: Scalars["Float"];
};

export type TokenAndId = {
    __typename?: "tokenAndId";
    accessToken?: Maybe<Scalars["String"]>;
    userId?: Maybe<Scalars["String"]>;
    name?: Maybe<Scalars["String"]>;
    userRoleCode?: Maybe<Scalars["String"]>;
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

export type CreateUserMutationVariables = Exact<{
    name: Scalars["String"];
    email: Scalars["String"];
    password: Scalars["String"];
    role_id: Scalars["String"];
}>;

export type CreateUserMutation = { __typename?: "Mutation" } & {
    createUser: { __typename?: "UserResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "field" | "message" | "method"
                >
            >
        >;
        user?: Maybe<
            { __typename?: "User" } & Pick<User, "id" | "name"> & {
                    role: { __typename?: "Role" } & Pick<Role, "name" | "code">;
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
                "accessToken" | "userId" | "userRoleCode"
            >
        >;
    };
};

export type Unnamed_1_MutationVariables = Exact<{ [key: string]: never }>;

export type Unnamed_1_Mutation = { __typename?: "Mutation" } & Pick<
    Mutation,
    "logout"
>;

export type UpdateSeetingsUserMutationVariables = Exact<{
    id: Scalars["String"];
    email: Scalars["String"];
    name: Scalars["String"];
    password: Scalars["String"];
    role_id: Scalars["String"];
    active: Scalars["Boolean"];
    file?: Maybe<Scalars["Upload"]>;
}>;

export type UpdateSeetingsUserMutation = { __typename?: "Mutation" } & {
    updateSeetingsUser: { __typename?: "UserResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "field" | "message" | "method"
                >
            >
        >;
        user?: Maybe<
            { __typename?: "User" } & Pick<User, "id" | "name" | "email"> & {
                    role: { __typename?: "Role" } & Pick<Role, "id" | "name">;
                }
        >;
    };
};

export type CreateCommentMutationVariables = Exact<{
    body: Scalars["String"];
    itemId: Scalars["String"];
    authorId: Scalars["String"];
    parentId?: Maybe<Scalars["String"]>;
    order?: Maybe<Scalars["Float"]>;
}>;

export type CreateCommentMutation = { __typename?: "Mutation" } & {
    createComment: { __typename?: "CommentResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "method" | "message" | "field"
                >
            >
        >;
        comment?: Maybe<
            { __typename?: "Comment" } & Pick<Comment, "id" | "body">
        >;
    };
};

export type GetAllRolesQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllRolesQuery = { __typename?: "Query" } & {
    getAllRoles: { __typename?: "RolesRespnse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "method" | "message" | "field"
                >
            >
        >;
        roles?: Maybe<
            Array<
                { __typename?: "Role" } & Pick<
                    Role,
                    "id" | "name" | "code" | "wage"
                >
            >
        >;
    };
};

export type GetAllUsersQueryVariables = Exact<{
    limit?: Maybe<Scalars["Float"]>;
    active: Scalars["Boolean"];
}>;

export type GetAllUsersQuery = { __typename?: "Query" } & {
    getAllUsers: { __typename?: "UsersResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "method" | "message" | "field"
                >
            >
        >;
        users?: Maybe<
            Array<
                { __typename?: "User" } & Pick<
                    User,
                    "id" | "name" | "email" | "active" | "picture"
                > & {
                        role: { __typename?: "Role" } & Pick<
                            Role,
                            "id" | "name"
                        >;
                    }
            >
        >;
    };
};

export type GetAppointmentsByItemQueryVariables = Exact<{
    limit?: Maybe<Scalars["Float"]>;
    itemId: Scalars["String"];
}>;

export type GetAppointmentsByItemQuery = { __typename?: "Query" } & {
    getAppointmentsByItem: { __typename?: "AppointmentsResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "method" | "message" | "field"
                >
            >
        >;
        appointments?: Maybe<
            Array<
                { __typename?: "Appointment" } & Pick<
                    Appointment,
                    "id" | "start" | "end"
                > & {
                        user: { __typename?: "User" } & Pick<
                            User,
                            "id" | "name"
                        >;
                    }
            >
        >;
    };
};

export type GetCommentsByItemQueryVariables = Exact<{
    itemId: Scalars["String"];
}>;

export type GetCommentsByItemQuery = { __typename?: "Query" } & {
    getCommentsByItem: { __typename?: "CommentsResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "message" | "method" | "field"
                >
            >
        >;
        comments?: Maybe<
            Array<
                { __typename?: "Comment" } & Pick<
                    Comment,
                    "id" | "body" | "order"
                > & {
                        parent?: Maybe<
                            { __typename?: "Comment" } & Pick<
                                Comment,
                                "id" | "body"
                            >
                        >;
                        author: { __typename?: "User" } & Pick<
                            User,
                            "name" | "picture"
                        >;
                        item: { __typename?: "Item" } & Pick<Item, "id">;
                        replies: Array<
                            { __typename?: "Comment" } & Pick<
                                Comment,
                                "id" | "body" | "order"
                            > & {
                                    author: { __typename?: "User" } & Pick<
                                        User,
                                        "name" | "picture"
                                    >;
                                }
                        >;
                    }
            >
        >;
    };
};

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

export type GetItensBacklogQueryVariables = Exact<{
    limit?: Maybe<Scalars["Float"]>;
    offset?: Maybe<Scalars["Float"]>;
}>;

export type GetItensBacklogQuery = { __typename?: "Query" } & {
    getItensBacklog: { __typename?: "ItensResponse" } & Pick<
        ItensResponse,
        "total"
    > & {
            errors?: Maybe<
                Array<
                    { __typename?: "ErrorFieldHandler" } & Pick<
                        ErrorFieldHandler,
                        "method" | "message" | "field"
                    >
                >
            >;
            itens?: Maybe<
                Array<
                    { __typename?: "Item" } & Pick<
                        Item,
                        | "id"
                        | "summary"
                        | "type"
                        | "priority"
                        | "status"
                        | "description"
                        | "updatedAt"
                        | "createdAt"
                    > & {
                            responsible: { __typename?: "User" } & Pick<
                                User,
                                "id" | "name"
                            >;
                            reporter: { __typename?: "User" } & Pick<
                                User,
                                "id" | "name"
                            >;
                            sprint: { __typename?: "Sprint" } & Pick<
                                Sprint,
                                "code" | "createdAt" | "length" | "final"
                            > & {
                                    project: { __typename?: "Project" } & Pick<
                                        Project,
                                        "name"
                                    >;
                                };
                        }
                >
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
                        > & {
                                itens: Array<
                                    { __typename?: "Item" } & Pick<
                                        Item,
                                        | "id"
                                        | "summary"
                                        | "description"
                                        | "status"
                                        | "priority"
                                        | "type"
                                    >
                                >;
                            }
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

export type GetUserSettingsQueryVariables = Exact<{
    id: Scalars["String"];
}>;

export type GetUserSettingsQuery = { __typename?: "Query" } & {
    getUserSettings: { __typename?: "UserResponse" } & {
        errors?: Maybe<
            Array<
                { __typename?: "ErrorFieldHandler" } & Pick<
                    ErrorFieldHandler,
                    "method" | "message" | "field"
                >
            >
        >;
        user?: Maybe<
            { __typename?: "User" } & Pick<
                User,
                "id" | "name" | "email" | "password" | "picture"
            > & {
                    role: { __typename?: "Role" } & Pick<
                        Role,
                        "id" | "name" | "code"
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
export const CreateUserDocument = gql`
    mutation CreateUser(
        $name: String!
        $email: String!
        $password: String!
        $role_id: String!
    ) {
        createUser(
            options: {
                name: $name
                password: $password
                email: $email
                role_id: $role_id
            }
        ) {
            errors {
                field
                message
                method
            }
            user {
                id
                name
                role {
                    name
                    code
                }
            }
        }
    }
`;

export function useCreateUserMutation() {
    return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(
        CreateUserDocument
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
                userRoleCode
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
export const UpdateSeetingsUserDocument = gql`
    mutation UpdateSeetingsUser(
        $id: String!
        $email: String!
        $name: String!
        $password: String!
        $role_id: String!
        $active: Boolean!
        $file: Upload
    ) {
        updateSeetingsUser(
            id: $id
            email: $email
            name: $name
            password: $password
            role_id: $role_id
            active: $active
            file: $file
        ) {
            errors {
                field
                message
                method
            }
            user {
                id
                name
                email
                role {
                    id
                    name
                }
            }
        }
    }
`;

export function useUpdateSeetingsUserMutation() {
    return Urql.useMutation<
        UpdateSeetingsUserMutation,
        UpdateSeetingsUserMutationVariables
    >(UpdateSeetingsUserDocument);
}
export const CreateCommentDocument = gql`
    mutation CreateComment(
        $body: String!
        $itemId: String!
        $authorId: String!
        $parentId: String
        $order: Float
    ) {
        createComment(
            body: $body
            itemId: $itemId
            parentId: $parentId
            authorId: $authorId
            order: $order
        ) {
            errors {
                method
                message
                field
            }
            comment {
                id
                body
            }
        }
    }
`;

export function useCreateCommentMutation() {
    return Urql.useMutation<
        CreateCommentMutation,
        CreateCommentMutationVariables
    >(CreateCommentDocument);
}
export const GetAllRolesDocument = gql`
    query GetAllRoles {
        getAllRoles {
            errors {
                method
                message
                field
            }
            roles {
                id
                name
                code
                wage
            }
        }
    }
`;

export function useGetAllRolesQuery(
    options: Omit<Urql.UseQueryArgs<GetAllRolesQueryVariables>, "query"> = {}
) {
    return Urql.useQuery<GetAllRolesQuery>({
        query: GetAllRolesDocument,
        ...options,
    });
}
export const GetAllUsersDocument = gql`
    query getAllUsers($limit: Float, $active: Boolean!) {
        getAllUsers(active: $active, limit: $limit) {
            errors {
                method
                message
                field
            }
            users {
                id
                name
                email
                active
                picture
                role {
                    id
                    name
                }
            }
        }
    }
`;

export function useGetAllUsersQuery(
    options: Omit<Urql.UseQueryArgs<GetAllUsersQueryVariables>, "query"> = {}
) {
    return Urql.useQuery<GetAllUsersQuery>({
        query: GetAllUsersDocument,
        ...options,
    });
}
export const GetAppointmentsByItemDocument = gql`
    query getAppointmentsByItem($limit: Float, $itemId: String!) {
        getAppointmentsByItem(itemId: $itemId, limit: $limit) {
            errors {
                method
                message
                field
            }
            appointments {
                id
                start
                end
                user {
                    id
                    name
                }
            }
        }
    }
`;

export function useGetAppointmentsByItemQuery(
    options: Omit<
        Urql.UseQueryArgs<GetAppointmentsByItemQueryVariables>,
        "query"
    > = {}
) {
    return Urql.useQuery<GetAppointmentsByItemQuery>({
        query: GetAppointmentsByItemDocument,
        ...options,
    });
}
export const GetCommentsByItemDocument = gql`
    query GetCommentsByItem($itemId: String!) {
        getCommentsByItem(itemId: $itemId) {
            errors {
                message
                method
                field
            }
            comments {
                id
                body
                order
                parent {
                    id
                    body
                }
                author {
                    name
                    picture
                }
                item {
                    id
                }
                replies {
                    id
                    body
                    order
                    author {
                        name
                        picture
                    }
                }
            }
        }
    }
`;

export function useGetCommentsByItemQuery(
    options: Omit<
        Urql.UseQueryArgs<GetCommentsByItemQueryVariables>,
        "query"
    > = {}
) {
    return Urql.useQuery<GetCommentsByItemQuery>({
        query: GetCommentsByItemDocument,
        ...options,
    });
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
export const GetItensBacklogDocument = gql`
    query GetItensBacklog($limit: Float, $offset: Float) {
        getItensBacklog(limit: $limit, offset: $offset) {
            errors {
                method
                message
                field
            }
            total
            itens {
                id
                summary
                type
                priority
                status
                description
                updatedAt
                createdAt
                responsible {
                    id
                    name
                }
                reporter {
                    id
                    name
                }
                sprint {
                    code
                    createdAt
                    length
                    final
                    project {
                        name
                    }
                }
            }
        }
    }
`;

export function useGetItensBacklogQuery(
    options: Omit<
        Urql.UseQueryArgs<GetItensBacklogQueryVariables>,
        "query"
    > = {}
) {
    return Urql.useQuery<GetItensBacklogQuery>({
        query: GetItensBacklogDocument,
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
                    itens {
                        id
                        summary
                        description
                        status
                        priority
                        type
                    }
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
export const GetUserSettingsDocument = gql`
    query GetUserSettings($id: String!) {
        getUserSettings(id: $id) {
            errors {
                method
                message
                field
            }
            user {
                id
                name
                email
                password
                picture
                role {
                    id
                    name
                    code
                }
            }
        }
    }
`;

export function useGetUserSettingsQuery(
    options: Omit<
        Urql.UseQueryArgs<GetUserSettingsQueryVariables>,
        "query"
    > = {}
) {
    return Urql.useQuery<GetUserSettingsQuery>({
        query: GetUserSettingsDocument,
        ...options,
    });
}
