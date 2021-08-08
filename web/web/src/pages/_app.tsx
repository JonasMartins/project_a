import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

import theme from "../theme";
import { Provider, createClient } from "urql";
import GlobalProvider from "./../context/globalContext";

const client = createClient({
    url: "http://localhost:4001/graphql",
    fetchOptions: {
        credentials: "include",
    },
});

function MyApp({ Component, pageProps }) {
    return (
        <GlobalProvider>
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
        </GlobalProvider>
    );
}

export default MyApp;
