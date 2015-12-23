var path = require('path');
var webpack = require('webpack');

var debug = process.env.NODE_ENV !== 'production';

module.exports = {
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      loader: 'babel',
      query: {
        presets: ['es2015','stage-0'],
        cacheDirectory: true,
        plugins: ['syntax-object-rest-spread']
      }
    },{
      test: /\.scss$/,
      loader: 'style!css'
    }]
  },
  entry: {
    index: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dest'),
    filename: '[name].js',
    publicPath: 'index.js'
  },
  resolve: {
    root: path.join(__dirname, '/'),
    extensions: ['', '.js', '.css', '.scss', 'less', '.ejs', '.png', '.jpg'],
    modulesDirectories: ["node_modules"]
  }
};
