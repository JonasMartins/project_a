import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  __typename?: 'ErrorFieldHandler';
  field: Scalars['String'];
  message: Scalars['String'];
  method: Scalars['String'];
};

export type Item = {
  __typename?: 'Item';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  summary: Scalars['String'];
  description: Scalars['String'];
  reporter: User;
  responsible: User;
  approver: User;
  status: ItemStatus;
};

export type ItemResponse = {
  __typename?: 'ItemResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  item?: Maybe<Item>;
};

/** The basic directions */
export const enum ItemStatus {
  Open = 'OPEN',
  InProgress = 'IN_PROGRESS',
  Reopened = 'REOPENED',
  Resolved = 'RESOLVED',
  Closed = 'CLOSED',
  Completed = 'COMPLETED'
};

export type ItemValidator = {
  summary: Scalars['String'];
  description: Scalars['String'];
  status: ItemStatus;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  accessToken?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createItem: ItemResponse;
  revokeRefreshTokensForUser: RevokeResponse;
  createUser: UserResponse;
  login: LoginResponse;
};


export type MutationCreateItemArgs = {
  approverId: Scalars['String'];
  responsibleId: Scalars['String'];
  reporterId: Scalars['String'];
  options: ItemValidator;
};


export type MutationRevokeRefreshTokensForUserArgs = {
  userId: Scalars['String'];
};


export type MutationCreateUserArgs = {
  options: UserBasicData;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getItemById: ItemResponse;
  hello: Scalars['String'];
  logedInTest: Scalars['String'];
  getUserById: UserResponse;
};


export type QueryGetItemByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['String'];
};

export type RevokeResponse = {
  __typename?: 'RevokeResponse';
  incrementado: Scalars['Boolean'];
  version?: Maybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  email: Scalars['String'];
  itenReporter: Array<Item>;
  itenResponsible: Array<Item>;
  itenApprover: Array<Item>;
};

export type UserBasicData = {
  name: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<ErrorFieldHandler>>;
  user?: Maybe<User>;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
    & { errors?: Maybe<Array<(
      { __typename?: 'ErrorFieldHandler' }
      & Pick<ErrorFieldHandler, 'field' | 'method' | 'message'>
    )>> }
  ) }
);

export type GetItemByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetItemByIdQuery = (
  { __typename?: 'Query' }
  & { getItemById: (
    { __typename?: 'ItemResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'ErrorFieldHandler' }
      & Pick<ErrorFieldHandler, 'method' | 'message'>
    )>>, item?: Maybe<(
      { __typename?: 'Item' }
      & Pick<Item, 'id' | 'summary' | 'description'>
      & { responsible: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name' | 'email'>
      ), approver: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name' | 'email'>
      ) }
    )> }
  ) }
);


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    errors {
      field
      method
      message
    }
    accessToken
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
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

export function useGetItemByIdQuery(options: Omit<Urql.UseQueryArgs<GetItemByIdQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetItemByIdQuery>({ query: GetItemByIdDocument, ...options });
};