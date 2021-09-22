import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

import theme from "../theme";
import { Provider, createClient } from "urql";
import GlobalProvider from "./../context/globalContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
                <DndProvider backend={HTML5Backend}>
                    <ChakraProvider resetCSS theme={theme}>
                        <ColorModeProvider
                            options={{
                                useSystemColorMode: true,
                            }}
                        >
                            <Component {...pageProps} />
                        </ColorModeProvider>
                    </ChakraProvider>
                </DndProvider>
            </Provider>
        </GlobalProvider>
    );
}

export default MyApp;
