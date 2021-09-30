import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";
import Favicon from "../components/rootComponents/Favicon";

class Document extends NextDocument {
    render() {
        return (
            <Html>
                <Head>
                    <meta charSet="utf-8" />
                    <Favicon />
                </Head>
                <body>
                    <ColorModeScript />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default Document;
