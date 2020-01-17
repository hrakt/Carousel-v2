import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <html lang="en">
                <Head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" type="image/png" href="/favicon-512x512.png" sizes="512x512" />
                    <link rel="icon" type="image/png" href="/favicon-192x192.png" sizes="192x192" />
                    <link rel="icon" type="image/png" href="/favicon-180x180.png" sizes="180x180" />
                    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
                    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
                    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
                    <meta name="description" content="" />
                    <meta property="og:url" content="" />
                    <meta property="og:description" content="" />
                    <meta property="og:image" content="" />
                    <meta property="og:type" content="website" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="" />
                    <meta name="twitter:creator" content="" />
                </Head>
                <body>
                    <div id="__background_portal__"></div>
                    <Main />
                    <div id="__foreground_portal__" />
                    <NextScript />
                </body>
            </html>
        );
    }
}
