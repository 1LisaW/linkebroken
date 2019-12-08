const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const PORT = 7777;
const HOST = `http://127.0.0.1`;

const PROXY_HOST = `${HOST}:8080`;

const ENTRY = './src/index.jsx';

const SRC = path.resolve(__dirname, './src');
const DIST = path.resolve(__dirname, './dist');

if (!fs.existsSync(DIST)) { fs.mkdirSync(DIST); }

module.exports = env => {
    const ENV = env || {};
    const DEV_MODE = !!ENV.development;
    const PROD_MODE = !!ENV.production;
    const MODE = DEV_MODE ? 'development' : 'production';
    const DEV_SERVER = !!ENV.server;

    if (DEV_SERVER) {
        console.log(JSON.stringify({ ENV, MODE, PORT, ENTRY, SRC, DIST }, null, 2));
    } else {
        console.log('BUILD APP')
    }

    return {

        mode: MODE,

        devtool: DEV_MODE ? 'source-map' : 'cheap-module-source-map',

        entry: {
            app: ENTRY,
        },

        output: {
            path: DIST,
            publicPath: '/',
            pathinfo: false,
            filename: PROD_MODE ? `bundles/[name]/[name].[contenthash].min.js` : `bundles/[name]/[name].js`,
            chunkFilename: PROD_MODE ? `chunks/[name]/[name].[contenthash].min.js` : `chunks/[name]/[name].js`,
        },

        devServer: {
            port: PORT,
            contentBase: DIST,
            historyApiFallback: {
                rewrites: [
                    { from: /^\/$/, to: '/index.html' },
                ],
            },
            proxy: [
                {
                    context: ["/api/**"],
                    target: PROXY_HOST,
                    changeOrigin: true,
                    secure: false
                }
            ],
            stats: {
                children: false,
                chunks: false,
                chunkModules: false,
                modules: false,
                reasons: false,
                entrypoints: true,
            },
        },

        module: {

            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                presets: [
                                    '@babel/preset-env',
                                    '@babel/preset-react',
                                ],
                                plugins: [
                                    '@babel/transform-runtime',
                                    '@babel/plugin-proposal-class-properties',
                                    '@babel/plugin-proposal-export-default-from',
                                ],
                            },
                        },
                        {
                            loader: 'eslint-loader',
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: DEV_MODE,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: DEV_MODE,
                            },
                        },
                        'postcss-loader',
                    ],
                },
                {
                    test: /\.(jpe?g|png|gif|ico|cur)$/i,
                    exclude: /node_modules/,
                    use: 'file-loader?hash=sha512&context=src&name=[path][name].[ext]?[hash]',
                },
                {
                    test: /\.(otf|ttf|eot|woff|woff2|svg)$/,
                    exclude: /node_modules/,
                    use: 'file-loader?hash=sha512&context=src&name=[path][name].[ext]',
                },
            ],
        },

        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {}
        },

        optimization: {

            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: 'vendor',
                        chunks: 'all',
                        priority: 20,
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 10,
                        reuseExistingChunk: true,
                        enforce: true
                    }
                }
            },


            minimizer: [

                new OptimizeCSSAssetsPlugin(),

                new TerserPlugin({
                    sourceMap: true,
                    cache: false,
                    parallel: true,
                    extractComments: true,
                    terserOptions: {
                        mangle: true,
                        parse: {},
                        compress: {
                            warnings: true,
                            drop_console: !ENV.console,
                        },
                    },
                }),
            ],
        },

        plugins: [

            new webpack.DefinePlugin({
                '__WEBPACK__': JSON.stringify({
                    server: DEV_SERVER,
                })
            }),

            new MiniCssExtractPlugin({
                filename: PROD_MODE ? `bundles/[name]/[name].[contenthash].min.css` : `bundles/[name]/[name].css`,
                chunkFilename: PROD_MODE ? `chunks/[id]/[id].[contenthash].min.css` : `chunks/[id]/[id].css`,
            }),

            new HtmlWebpackPlugin({
                inject: false,
                hash: true,
                template: './src/index.ejs',
                filename: './index.html',
                chunksSortMode: 'manual',
                chunks: ['vendor', 'app'],
                title: `LinkeBroken`,
            }),
        ],

        node: {
            __filename: true,
            __dirname: true,
            console: true,
            fs: 'empty',
            net: 'empty',
            tls: 'empty'
        },

        performance: {
            hints: PROD_MODE ? 'warning' : false,
        },

        stats: {
            children: false,
            chunks: false,
            chunkModules: false,
            modules: false,
            reasons: false,
        },
    };
};
