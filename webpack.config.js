const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    target: "node",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    externals: [nodeExternals()], // Exclude node_modules from bundling
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader", // Transpile JavaScript using Babel
                },
            },
        ],
    },
    resolve: {
        extensions: [".js"], // Resolve .js files
    },
};
