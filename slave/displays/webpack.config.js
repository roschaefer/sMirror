const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        news: './assets/src/js/news.js',
        twitter: './assets/src/js/twitter.js',
        tagesschau: './assets/src/js/tagesschau.js',
        weather: './assets/src/js/weather.js',
        maus: './assets/src/js/maus.js'
        transit: './assets/src/js/transit.js',
    },
    output: {
        path: path.join(__dirname, 'assets/dist/js/'), 
        filename: '[name].js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                    },
                },
            },
        ],
    },
};