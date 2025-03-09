const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js', // Webpack bundles everything into main.js
    clean: true,
  },
  mode: 'development',
  devServer: {
    static: './dist',
    port: 8081,
    hot: true,
    historyApiFallback: true, // Fixes deep route issues
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/views/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/style.css',
    }),
    new InjectManifest({
      swSrc: path.resolve(__dirname, 'src/client/js/service-worker.js'), // Correct path to service worker
      swDest: 'service-worker.js',
    }),
  ],
};
