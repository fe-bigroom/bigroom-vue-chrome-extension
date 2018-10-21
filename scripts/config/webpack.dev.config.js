const path = require('path')
const webpackMerge = require('webpack-merge')
// const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin');
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');

const entries = require('./utils/entries')();
console.log(entries)
const baseWebpackConfig = require('./webpack.base.config')

module.exports = webpackMerge(baseWebpackConfig, {
  output: {
    filename: '[name]/[name].js',
    path: path.resolve(process.cwd(), 'dist/dev/modules')
  },
  devServer: {
    contentBase: './dist/dev',
    outputPath: path.join(process.cwd(), './dist/dev'),
    compress: true,
    hot: true
  },
  mode: 'development',
  plugins: [
    new WriteFilePlugin({
      test: /(background\.js|vendor\.js|content\.js|manifest\.json)$/,
    }),
    new ChromeExtensionReloader({
      port: 9090, // Which port use to create the server
      reloadPage: true, // Force the reload of the page also
      entries: {
        background: 'background.js',
        content: 'content.js',
        popup: 'popup.js'
      }
    }),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin()
  ]
})
