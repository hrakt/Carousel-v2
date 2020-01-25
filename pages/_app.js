import 'styles/theme.scss';

import React from 'react';
import App from 'next/app';
import Head from 'next/head';

class DefaultApp extends App {
    render() {
        const { Component, pageProps } = this.props;

        return (
            <React.Fragment>
                <Head>
                    <title>Playground</title>
                </Head>
                <Component {...pageProps} />
            </React.Fragment>
        );
    }
}

export default DefaultApp;
