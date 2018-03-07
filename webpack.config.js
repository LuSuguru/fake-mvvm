const HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')
var node_modules = path.resolve(__dirname, 'node_modules')
// var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
// var pathToReactRouter = path.resolve(node_modules, 'react-router/umd/ReactRouter.min.js');

module.exports = {
  entry: path.resolve(__dirname, 'src/vue.js'),

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },

  devtool: 'source-map',

  module: {
    loaders: [{
      test: /\.js$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
      loader: 'babel', // 加载模块 "babel" 是 "babel-loader" 的缩写
      query: {
        presets: ['env']
      },
      exclude: /node_modules/,
    }]
  },
  // 本地服务器配置
  devServer: {
    port: 8082,
    inline: true, //实时刷新
    progress: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: require.resolve('./build/index.html')
    }),
  ]
}
