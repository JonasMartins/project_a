import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import theme from "../theme";

const client = createClient({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include",
    },
    exchanges: [dedupExchange, cacheExchange({}), fetchExchange],
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
