import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
    const mapKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    return (
        <Html>
            <Head>
                <meta
                    name="description"
                    content="A retail app powered by beckn protocol"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500&display=swap"
                    rel="stylesheet"
                />
                <link
                    rel="shortcut icon"
                    href="/images/zishop.ico"
                />
            </Head>
            <body>
                <script
                    src={`https://maps.googleapis.com/maps/api/js?key=${mapKey}&callback=Function.prototype&libraries=places`}
                    async
                    defer
                ></script>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
