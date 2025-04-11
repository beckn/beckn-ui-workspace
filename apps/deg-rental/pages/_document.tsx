import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="description"
          content="A retail app powered by beckn protocol"
        />
        <meta
          name="theme-color"
          content="#000000"
        />
        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="Open Spark Solaris"
        />
        <meta
          name="format-detection"
          content="telephone=no"
        />
        <meta
          name="mobile-web-app-capable"
          content="yes"
        />
        <link
          rel="manifest"
          href="/manifest.json"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="shortcut icon"
          href="./images/rental_app_logo.svg"
        />
      </Head>
      <body>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDj_jBuujsEk8mkIva0xG6_H73oJEytXEA&callback=Function.prototype&libraries=places"></script>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
