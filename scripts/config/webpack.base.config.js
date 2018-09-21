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
        PORT: JSON.stringify(config.port)
      }
    }),
    new CopyWebpackPlugin([ // If you want webpack-dev-server to write files to the output directory during development, you can force it with the write-file-webpack-plugin.
      {
        from: `./src/manifest.${env}.json`,
        to: resolve(`dist/${env}/manifest.json`),
        toType: 'file'
      }
    ])
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        commons: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
					minChunks: 2,
					maxInitialRequests: 5, // The default limit is too small to showcase the effect
					minSize: 0 // This is example is too small to create commons chunks
				}
      }
    }
  }
}
