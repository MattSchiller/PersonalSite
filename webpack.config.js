const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = () => {
    const config = {
        mode: "development",

        entry: path.join(__dirname, "./src/ts/Main.tsx"),

        output: {
            path: __dirname + '/build',
            filename: 'bundle.js'
        },

        resolve: {
            extensions: [".tsx", ".ts", ".js", ".css", ".scss"],

            // NOTE: You should make an entry in tsconfig.json as well for each of these entries.
            alias: {
                "@Sass": path.resolve(__dirname, "src/sass/"),
                "@HTML": path.resolve(__dirname, "src/html/"),
                "@Redux": path.resolve(__dirname, "src/ts/Redux/"),
                "@Pages": path.resolve(__dirname, "src/ts/Pages/"),
                "@Interfaces": path.resolve(__dirname, "src/ts/Interfaces/"),
                "@Components": path.resolve(__dirname, "src/ts/Components/"),
                "@SimType": path.resolve(__dirname, "src/ts/SimType/"),
            },
        },

        module: {
            rules: [
                {
                    // TypeScript
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true     // This is used with ForkTSCheckerWebpackPlugin to speed up builds.
                        }
                    }
                },
                {
                    // Sass + CSS
                    test: /\.(s*)css$/,
                    exclude: /node_modules/,
                    use: [
                        { loader: "style-loader" },
                        {
                            loader: "typings-for-css-modules-loader",
                            options: {
                                namedExport: true,
                                camelCase: "only",
                                modules: true,
                                localIdentName: "[local]"
                            }
                        },
                        { loader: "sass-loader" }
                    ]
                }
            ]
        },

        devtool: "eval-source-map",

        devServer: {
            headers: { "Access-Control-Allow-Origin": "*" },
            hot: true,
            open: true,
            openPage: "index.html",
            inline: true,
            https: true,
            host: "localhost",
            port: 8080
        },

        plugins: [
            new webpack.HotModuleReplacementPlugin(),

            new HtmlWebpackPlugin({
                hash: true,
                filename: "index.html",
                template: __dirname + "/src/html/index.html",
                favicon: __dirname + "/assets/images/favicon.ico"
            }),

            // Ignore the changes in any auto-created d.ts files for TypeScript (like typings-for-css-loader makes).
            new webpack.WatchIgnorePlugin([/\.d\.ts$/]),
        ]
    };

    return config;
};
