"use strict";
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

// Import core Webpack library to use some of the built in plugins.
const webpack = require("webpack");
// NodeJS path module for working with file and directory paths
const path = require("path");
// Generate HTML files for serving webpack bundle
const HtmlWebpackPlugin = require("html-webpack-plugin");
// makes sure case senstive paths are enforced on systems that do not enforce
// case sensitivity (such as most macOS installations)
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
// PostCSS autoprefixer
const autoprefixer = require("autoprefixer");

// used to determine the base url the application is served from
// set as web server root.
const publicPath = "/";
const srcPath = path.join(__dirname, "/src");
const htmlPath = path.join(__dirname, "/src/templates/template.html");

// create a stringified version of some environment variables to have availalbe to JS code
const env = require("./config/env")(["NODE_ENV", "BABEL_ENV"]);

module.exports = {
  // Source Maps: http://webpack.github.io/docs/configuration.html#devtool
  devtool: "cheap-module-eval-source-map",

  // entry points for the application
  entry: {
    app: [
      // webpack dev server client
      require.resolve("webpack-dev-server/client") + "?/",
      // Webpack hot module replacement runtime
      require.resolve("webpack/hot/dev-server"),
      // Took this from create-react-app. injects some polyfills
      // into the build
      require.resolve("./config/polyfills"),
      // root of our JS app.
      path.join(__dirname, "/src/js/index.js"),
      path.join(__dirname, "/src/sass/main.scss")
    ]
  },
  // this is where the bundled output is sent
  output: {
    // Where to point source map entries.
    // https://webpack.js.org/configuration/output/#output-devtoolmodulefilenametemplate
    devtoolModuleFilenameTemplate: "webpack:///[absolute-resource-path]",
    // When using dev server, the build doesn't acutally go here
    // but webpack needs it anyway
    path: path.join(__dirname, "/dist/"),
    // The name of the output bundle. [name] matches the entry name
    // in this case, "app"
    filename: "[name].js",
    // As noted above, base url the application is served from
    publicPath: publicPath
  },
  devServer: {
    // Enable gzip compression of generated files.
    compress: true,
    // turn off WebpackDevServer's own logging
    clientLogLevel: "none",
    // Hot reloading, CSS updates in browser, JS changes cause a reload
    hot: true,
    // serve from the same root path as used above
    publicPath: publicPath,
    // output from from the dev server so you can see what is going on, if it
    // is too noisy for your, flip to true
    quiet: false,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/
    },
    overlay: false,
    port: 8888,
    historyApiFallback: {
      disableDotRule: true
    }
  },
  module: {
    // throw an error if trying to import an export that doesn't exist
    strictExportPresence: true,
    rules: [
      {
        // An array of Rules from which only the first matching Rule is used when the Rule matches.
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "static/media/[name].[ext]"
            }
          },
          // Process JavaScript with Babel.
          {
            test: /\.(js|jsx)$/,
            include: srcPath,
            loader: require.resolve("babel-loader"),
            options: {
              babelrc: false, // not using .babelrc, instead using the preset below
              presets: [require.resolve("babel-preset-react-app")],
              // makes rebuilds faster by having babel-loader
              // cache builds in ./node_modules/.cache/babel-loader/
              cacheDirectory: true
            }
          },
          // Proccess CSS:
          // "style loader" injects the CSS into <style tags> in dev, in prod and test css is extracted into a separate file
          // "css loader" interprets @import and url() like import/require() and will resolve them.
          // "postcss" is used for autoprefixer
          // "sass loader" compules SCSS to CSS
          {
            test: /\.scss$/,
            use: [
              require.resolve("style-loader"),
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: "postcss",
                  plugins: () => [
                    require("postcss-flexbugs-fixes"),
                    autoprefixer({
                      browsers: [
                        ">1%",
                        "last 4 versions",
                        "Firefox ESR",
                        "not ie < 9" // React doesn't support IE8 anyway
                      ],
                      flexbox: "no-2009"
                    })
                  ]
                }
              },
              {
                loader: require.resolve("sass-loader")
              }
            ]
          },
          // "file" Instructs webpack to emit the required object as file and to return its public URL
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: require.resolve("file-loader"),
            options: {
              name: "assets/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      title: "NODE40 Front End Challenge",
      template: htmlPath,
      favicon: "src/images/favicon.ico"
    }),
    // Makes above environment variables available to the JS code
    new webpack.DefinePlugin(env),
    // hot reloading
    new webpack.HotModuleReplacementPlugin(),
    // Gives errors if you use the wrong case in a path
    new CaseSensitivePathsPlugin()
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false
  }
};
