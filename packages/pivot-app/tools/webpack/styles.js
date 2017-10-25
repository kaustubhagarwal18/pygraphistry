const path = require('path');
const HappyPack = require('happypack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = addStyleLoaders;

function addStyleLoaders({ type, isDev, threadPool, CSSModules, environment }, appConfig) {
    const createCSSSourceMaps = !isDev && type === 'client';
    let rules = [
        {
            test: /\.css$/,
            use: ['happypack/loader?id=css']
        },
        {
            test: /\.less$/,
            use: [
                cssLoader(type, isDev, CSSModules, createCSSSourceMaps),
                {
                    loader: 'postcss-loader',
                    options: { sourceMap: createCSSSourceMaps }
                },
                'happypack/loader?id=less'
            ]
        }
    ];

    if (type === 'client') {
        rules = rules.map(rule => ({
            test: rule.test,
            loader: ExtractTextPlugin.extract({
                use: rule.use,
                fallback: 'style-loader'
            })
        }));

        appConfig.plugins.push(
            new ExtractTextPlugin({
                disable: isDev, // Disable css extracting on development
                allChunks: true,
                ignoreOrder: CSSModules,
                filename: '[name].[contenthash:8].css'
            })
        );
    }

    appConfig.module.rules.push(...rules);

    appConfig.plugins.push(
        new HappyPack({
            id: 'css',
            verbose: false,
            threadPool: threadPool,
            loaders: [cssLoader(type, isDev, false, createCSSSourceMaps)]
        })
    );

    appConfig.plugins.push(
        new HappyPack({
            id: 'less',
            verbose: false,
            threadPool: threadPool,
            loaders: [
                {
                    loader: 'less-loader',
                    options: {
                        outputStyle: 'expanded',
                        sourceMapContents: !isDev,
                        sourceMap: createCSSSourceMaps
                    }
                }
            ]
        })
    );

    return appConfig;
}

function cssLoader(type, isDev, CSSModules, createCSSSourceMaps) {
    return {
        loader: `css-loader${type === 'client' ? '' : '/locals'}`,
        options: {
            minimize: !isDev,
            modules: CSSModules,
            sourceMap: createCSSSourceMaps,
            context: path.join(process.cwd(), './src'),
            localIdentName: isDev ? '[name]__[local].[hash:base64:5]' : '[hash:base64:5]'
        }
    };
}