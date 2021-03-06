var webpack = require('webpack');
var postcssImport = require('postcss-import');
var postcssUrl = require('postcss-url');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var config = require('./config.json');

module.exports = {
    entry: {
        app: './src/app/index.js',
        lib: [
            'history',
            'react',
            'react-dom',
            'react-redux',
            'react-router',
            'redux',
            'redux-thunk'
        ]
    },
    output: {
        path: config.dest,
        filename: '[name]-[chunkhash].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader')
            },
            {
                test: /\.(eot|ttf|woff|woff2)/,
                loader: 'file-loader?name=[name]-[hash].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=10000&name=[name]-[hash].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('lib', 'lib-[chunkhash].js'),
        new ExtractTextPlugin("index-[contenthash].css"),
        new webpack.optimize.UglifyJsPlugin({
            warnings: false
        })
    ],
    postcss: function (webpack) {
        return [
            postcssImport({
                addDependencyTo: webpack
            }),
            postcssUrl()
        ];
    }
};