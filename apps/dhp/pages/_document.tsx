import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content="A retail app powered by beckn protocol" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/images/HomePageLogo.svg" />
      </Head>
      <body>
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDj_jBuujsEk8mkIva0xG6_H73oJEytXEA&callback=Function.prototype&libraries=places"
          async
          defer
        ></script>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
