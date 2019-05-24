const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

process.env.NODE_ENV = "development";
/*
    * mode development turns of some production features
    * target can be node also, in this case we need web
    * cheap-module-source-map generates a source map for debugging - it allows us to see 
      our original code in the browser (and not some minified crap)
    * entry - index.js 
    * output - where do we want webpack to output. well technically webpack does not output code in dev mode
      and serves it from memory. __dirname gives the current directory name. also its not going to write a file
      to build, in memory it will be serving from this directory (err?)
    * publicPath set to "/", specifies the public url of the output directory when its referenced in the browser
    * we will set the filename of our bundle to bundle.js (physical file not generated for development). its required
      so that the html can reference the bundle that is being served from memory.
    * devServer - specify the stuff for serving up our development server. you can use any node based web server such 
      as Express. here we will serve it by webpack since its simple and works great. 
      * stats set to minmal so that it limits the shit written to command line to minimal
      * overlay true - overlay any errors that occur in the browser
      * historyApiFallback is true - all requests will be sent to index.html, so we can load deep links and ReactRouter can handle them
      * disableHostCheck, headers, https are required when using the latest version of Chrome (open issue with webpack)
    * Plugins:
      * specify them in an array
      * we will use HtmlWebpackPlugin, which accepts an object to configure the plugin
      * lets tell the plugin where to find our html template, which is in the source directory
      * and also the favicon
    * module - we tell webpack what files we want it to handle, and we declare that using an array of rules
      * test - regex how to find our javasscript files
      * lets exclude node modules since we don't need it to process those files
      * the "use" property tells webpack what to do with these javascript files (we want to run babel on these files)
      * so lets put bable-loader
      * webpack will bunlde all of this for us
      * we can also have webpack process our css, so write a test, exclude and use for it
      * "style-loader", "css-loader" will allow us to import CSS just like we do Javascript, and webpack
        bundles all this into a single file
    
    Also removed eslint dependencies from package.json
        "eslint": "5.15.2",
        "eslint-loader": "2.1.2",
        "eslint-plugin-import": "2.16.0",
        "eslint-plugin-react": "7.12.4",

*/
module.exports = {
  mode: "development",
  target: "web",
  devtool: "cheap-module-source-map",
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    stats: "minimal",
    overlay: true,
    historyApiFallback: true,
    disableHostCheck: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    https: false
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.API_URL": JSON.stringify("http://127.0.0.1:8000")
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      favicon: "src/favicon.ico"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /(\.css)$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
