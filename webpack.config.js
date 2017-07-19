const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: {
    'bundle.js': './src/game.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]',
  },
  // module: {
  //   loaders: [
  //     {
  //       test: /\.js$/,
  //       loader: 'babel-loader',
  //       query: {
  //         presets: ['es2015'],
  //       },
  //     },
  //   ],
  // },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 8080,
      server: { baseDir: path.resolve(__dirname, '') },
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, ''),
  },
};
