import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Cache, QueryInput } from "@urql/exchange-graphcache";
import theme from "../theme";

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider resetCSS theme={theme}>
            <ColorModeProvider
                options={{
                    useSystemColorMode: true,
                }}
            >
                <Component {...pageProps} />
            </ColorModeProvider>
        </ChakraProvider>
    );
}

export default MyApp;
