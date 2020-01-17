import 'styles/theme.scss';

import React from 'react';
import App from 'next/app';
import Head from 'next/head';

import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import { makeStore } from 'store';

class DefaultApp extends App {
    render() {
        const { Component, pageProps, store } = this.props;

        return (
            <React.Fragment>
                <Head>
                    <title>App</title>
                </Head>
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </React.Fragment>
        );
    }
}

export default withRedux(makeStore)(DefaultApp);
