const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');
const withPlugins = require('next-compose-plugins');
const withSourceMaps = require('@zeit/next-source-maps')();
const withSass = require('@zeit/next-sass');
const withTM = require('next-transpile-modules');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = withPlugins([
    // sass plugin
    [
        withSass,
        {
            cssModules: true,
            cssLoaderOptions: {
                localIdentName: '[name]_[local]___[hash:base64:5]',
            },
            useFileSystemPublicRoutes: false,
            webpack: (config, options) => {
                if (!options.isServer && !options.dev) {
                    config.optimization.splitChunks.cacheGroups.commons.minChunks = 2;
                }
                config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
                config.module.rules.push({
                    test: /\.(frag|vert|glsl|glb)$/,
                    loader: ['raw-loader'],
                });
                config.plugins.push(
                    new FilterWarningsPlugin({
                        exclude: /(mini-css-extract-plugin|extract-css-chunks-plugin)[^]*Conflicting order between:/,
                    })
                );
                return config;
            },
        },
    ],
    // transpile modules plugin
    [
        withTM,
        {
            transpileModules: ['gsap'],
        },
    ],
    // source maps in production
    [withSourceMaps],
    {
        publicRuntimeConfig: {
            contentful: {
                space: 'i0ieahc5gzln',
                env: 'master',
                token:
                    process.env.CONTENTFUL_TOKEN ||
                    'dGGASMMqKkfTyM0bgJ3ERMGlDVxYYyqlXu4SdMM9dcI',
                host: process.env.CONTENTFUL_HOST || 'cdn.contentful.com', // also, hardcoded into docker-compose.dev.yml
            },
        },
    },
]);
