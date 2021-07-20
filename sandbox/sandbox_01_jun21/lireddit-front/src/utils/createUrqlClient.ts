import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import {
    LogoutMutation,
    MeQuery,
    MeDocument,
    LoginMutation,
    RegisterMutation,
} from "../generated/graphql";
import { dedupExchange, fetchExchange } from "urql";

function customQueryUpdate<Result, Query>(
    cache: Cache,
    queryUpdate: QueryInput,
    result: any,
    fn: (result: Result, query: Query) => Query | any
) {
    return cache.updateQuery(
        queryUpdate,
        (data) => fn(result, data as any) as any
    );
}

export const createUrqlCleint = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include" as const,
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
            updates: {
                Mutation: {
                    logout: (_result, args, cache, info) => {
                        customQueryUpdate<LogoutMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            () => {
                                return {
                                    me: null,
                                };
                            }
                        );
                    },

                    login: (_result, args, cache, info) => {
                        customQueryUpdate<LoginMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.login.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.login.user,
                                    };
                                }
                            }
                        );
                    },

                    register: (_result, args, cache, info) => {
                        customQueryUpdate<RegisterMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.register.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.register.user,
                                    };
                                }
                            }
                        );
                    },
                },
            },
        }),
        ssrExchange,
        fetchExchange,
    ],
});
