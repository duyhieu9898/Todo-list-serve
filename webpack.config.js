// webpack.config.js
var path = require("path");
module.exports = {
    // This is the "main" file which should include all other modules
    entry: "./resources/assets/js/app.js",
    // Where should the compiled file go?
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname)
    },
    resolve: {
        extensions: [".js", ".vue", ".json", "jsx"],
        alias: {
            vue$: "vue/dist/vue.js"
        }
    },
    module: {
        // Special compilation rules
        loaders: [
            {
                // Ask webpack to check: If this file ends with .js, then apply some transforms
                test: /\.(js|jsx)/,
                // Transform it with babel
                loader: "babel-loader",
                // don't transform node_modules folder (which don't need to be compiled)
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            }
        ]
    }
};
