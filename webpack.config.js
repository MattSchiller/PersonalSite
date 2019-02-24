const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
    const config = {
        mode: getMode(argv),

        entry: path.join(__dirname, "./src/ts/Main.tsx"),

        output: {
            path: __dirname + "/build",
            filename: "bundle.js",
            publicPath: (getMode(argv) === "production") ? "/build" : "/",
        },

        externals: {
            react: "React",
            "react-dom": "ReactDOM",
            "Router": ["./react-router-dom", "Router"],
            "Route": ["./react-router-dom", "Route"],
            Provider: ["./react-redux", "Provider"],
            connect: ["./react-redux", "connect"],
        },

        resolve: {
            extensions: [".tsx", ".ts", ".js", ".css", ".scss"],

            // NOTE: You should make an entry in tsconfig.json as well for each of these entries.
            alias: {
                "@Sass": path.resolve(__dirname, "src/sass/"),
                "@HTML": path.resolve(__dirname, "src/html/"),
                "@Redux": path.resolve(__dirname, "src/ts/Redux/"),
                "@Pages": path.resolve(__dirname, "src/ts/Pages/"),
                "@Components": path.resolve(__dirname, "src/ts/Components/"),
                "@SimType": path.resolve(__dirname, "src/ts/SimType/"),
                "@Helpers": path.resolve(__dirname, "src/ts/Helpers/"),
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
                        { loader: "sass-loader" },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: [
                                    require("autoprefixer")
                                ]
                            }
                        }
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
            port: 8080,
            historyApiFallback: true,
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

function getMode(argv) {
    let mode = "development";
    if (argv !== undefined && argv.mode !== undefined)
        mode = argv.mode;
    return mode;
}
