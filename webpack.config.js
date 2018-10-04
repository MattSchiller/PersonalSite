const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = () => {
    const config = {
        entry: path.join(__dirname, "./src/scripts/main.jsx"),
        output: {
            path: __dirname + '/build',
            filename: 'bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: "babel-loader",
                    exclude: /node_modules/,
                }
            ],
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),

            new HtmlWebpackPlugin({
                hash: true,
                filename: "index.html",
                template: __dirname + "/index.html",
                favicon: __dirname + "/assets/images/favicon.ico"
            })
        ]
    };

    return config;
};
