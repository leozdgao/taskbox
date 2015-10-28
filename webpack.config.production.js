/* eslint-disable */
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var AssetsPlugin = require('assets-webpack-plugin')

var assetsOutput = path.join(__dirname, 'server', 'assets')

module.exports = {
  devtool: 'source-map',
  entry: './src/index',
  output: {
    path: assetsOutput,
    filename: '[hash].js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      '__DEVTOOLS__': false,
      'process.env': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    }),
    new ExtractTextPlugin('[hash].css'),
    new AssetsPlugin({
      path: assetsOutput,
      filename: 'assets-client.json'
    })
  ],
  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css?importLoaders=2&sourceMap!autoprefixer?browsers=last 2 versions!less'),
        exclude: /node_modules/
      },
      {
        test: /\.css/,
        loader: 'style!css?importLoaders=1&sourceMap!autoprefixer?browsers=last 2 versions',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    'react': 'React',
    'react-router': 'ReactRouter',
    'react-dom': 'ReactDOM',
    'redux': 'Redux',
    'react-redux': 'ReactRedux',
    'socket.io-client': 'io',
    'react-addons-shallow-compare': 'React.addons.shallowCompare',
    'react-addons-transition-group': 'React.addons.CSSTransitionGroup',
    'react-addons-update': 'React.addons.update'
  }
}
