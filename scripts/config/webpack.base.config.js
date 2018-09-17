const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const entrys = require('./utils/entrys')

const resolve = function (dir) {
  return path.join(process.cwd(), './', dir)
}

const distDir = process.env.NODE_ENV !== 'production' ? 'dev' : 'prod'

module.exports = {
  entry: entrys,
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: [
            'vue-style-loader',
            'css-loader',
            'less-loader'
          ]
        }
      },

      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader?cacheDirectory=true',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        PORT: JSON.stringify(process.env.PORT || 3000),
        PUBLIC_PATH: JSON.stringify(process.env.PUBLIC_PATH || 'js/')
      }
    }),
    new CopyWebpackPlugin([
      {
        from: './src/modules/content/inject.js',
        to: resolve(`dist/${distDir}/modules/content/inject.js`),
        toType: 'file'
      },
      {
        from: './src/${distDir}/manifest.json',
        to: resolve(`dist/${distDir}/manifest.json`)
      }
    ]),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
