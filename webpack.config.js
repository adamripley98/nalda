const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    './frontend/index'
  ],
  module: {
    rules: [
        { test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.s?css$/, loader: 'style-loader!css-loader!sass-loader' },
        { test: /\.(png|jpg|gif)$/, use: [{ loader: 'file-loader', options: {}}] },
        { test: /\.svg$/, use: [{loader: "babel-loader"}, {loader: "react-svg-loader", options: {jsx: true}}] },
    ],
  },
  resolve: {
    extensions: ['.js', '.scss'],
  },
  // target: 'node',
  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: 'cheap-eval-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: './public',
    hot: true
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]
};
