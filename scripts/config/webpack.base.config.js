const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const entrys = require('./utils/entrys')
const config = require('./index')

const resolve = function (dir) {
  return path.join(process.cwd(), './', dir)
}

const env = config.env !== 'production' ? 'dev' : 'prod'

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
        NODE_ENV: JSON.stringify(config.env),
        PORT: JSON.stringify(config.port),
        PUBLIC_PATH: JSON.stringify(config.publicPath)
      }
    }),
    new CopyWebpackPlugin([ // If you want webpack-dev-server to write files to the output directory during development, you can force it with the write-file-webpack-plugin.
      {
        from: './src/modules/content/inject.js',
        to: resolve(`dist/${env}/modules/content/inject.js`),
        toType: 'file'
      },
      {
        from: `./src/manifest.${env}.json`,
        to: resolve(`dist/${env}/manifest.json`),
        toType: 'file'
      }
    ])
  ]
}
