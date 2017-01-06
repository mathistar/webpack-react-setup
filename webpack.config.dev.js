import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  noInfo: false,
  entry: {
    vendor: [
      "react-hot-loader/patch",
      'eventsource-polyfill', // necessary for hot reloading with IE
      "webpack-dev-server/client?http://localhost:3000",
      "webpack/hot/only-dev-server",
      path.resolve(__dirname, 'src/vendor')],
    main: [path.resolve(__dirname, 'src/index-dev')]
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx"]
  },

  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'js/[name]-[hash].min.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src')
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),

    // Generate an external css file with a hash in the filename
    // new ExtractTextPlugin('[name].[contenthash].css'),
    // Hash the files using MD5 so that their names change when the content changes.
    new WebpackMd5Hash(),
    // Use CommonsChunkPlugin to create a separate bundle
    // of vendor libraries so that they're cached separately.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/, include: path.join(__dirname, 'src'),
        loaders: ['react-hot-loader/webpack', 'babel']
      },
      // {test: /(\.css)$/, loader: ExtractTextPlugin.extract('css?sourceMap')},
      {test: /(\.css)$/, loader: 'style!css?sourceMap'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&name=fonts/[name].[ext]"},
      {test: /\.(woff|woff2)$/, loader: "url?limit=10000&name=fonts/[name].[ext]"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml&name=fonts/[name].[ext]"}
    ]
  }
};
