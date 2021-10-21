import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { LoginDocument, LoginMutation } from "./../generated/graphql";

export const withUrqlClient = (_ssrExchange: any, ctx: any) => ({
    url: "http://localhost:4001/graphql",
    fetchOptions: {
        credentials: "include" as const,
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
            updates: {
                Mutation: {
                    login: (_result: LoginMutation, _args, cache, _info) => {
                        cache.updateQuery({ query: LoginDocument }, () => {
                            if (_result.login.errors) {
                                return _result.login.errors;
                            }
                            return _result.login.result;
                        });
                    },
                },
            },
        }),
        _ssrExchange,
        fetchExchange,
    ],
});
