const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const dist = path.resolve(__dirname, "dist");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

const appConfig = {
  target: 'web',
  entry: "./js/index.js",
  output: {
    path: dist,
    filename: '[name].[hash].js',
  },
  devServer: {
    contentBase: dist
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      chunks: ['main']
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      }
    ]
  }
}

workerConfig = {
  target: 'webworker',
  entry: "./js/worker.js",
  output: {
    path: dist,
    filename: 'worker.js',
    globalObject: 'self'
  },
  devServer: {
    contentBase: dist
  },
  resolve: {
    extensions: [".js", ".wasm"]
  },
  plugins: [
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "crate"),
      // WasmPackPlugin defaults to compiling in "dev" profile. To change that, use forceMode: 'release':
      // forceMode: 'release'
    }),
  ]
}

module.exports = [appConfig, workerConfig]
