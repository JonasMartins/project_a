import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import {
    LoginMutation,
    MeDocument,
    MeQuery,
    RegisterMutation,
} from "../generated/graphql";
import theme from "../theme";

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

const client = createClient({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include",
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
            updates: {
                Mutation: {
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
        fetchExchange,
    ],
});

function MyApp({ Component, pageProps }) {
    return (
        <Provider value={client}>
            <ChakraProvider resetCSS theme={theme}>
                <ColorModeProvider
                    options={{
                        useSystemColorMode: true,
                    }}
                >
                    <Component {...pageProps} />
                </ColorModeProvider>
            </ChakraProvider>
        </Provider>
    );
}

export default MyApp;
