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
      'eventsource-polyfill', // necessary for hot reloading with IE
      "webpack-dev-server/client?http://localhost:3000",
      "webpack/hot/only-dev-server",
      path.resolve(__dirname, 'src/vendor')],
    main: [path.resolve(__dirname, 'src/index.tsx')]
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'js/[name]-[hash].min.js'
  },
  devserver: {

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
    // new ExtractTextPlugin('css/[name].[contenthash].css'),
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
   /* preLoaders: [
      {
        test: /\.tsx?$/,
        loader: 'tslint',
        exclude: /node_modules/
      }
    ],*/
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.tsx?$/,
        loaders: [
          "react-hot",
          "awesome-typescript-loader"
        ],
        exclude: path.resolve(__dirname, 'node_modules'),
        include: path.resolve(__dirname, "src")
      },
      // {test: /(\.css)$/, loader: ExtractTextPlugin.extract('style-loader','css-loader')},
      {test: /(\.css)$/, loader: 'style!css'},
      {test: /\.(eot|woff2?|jpe?g|png)(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&name=fonts/[name].[ext]"},
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]"
      },
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml&name=fonts/[name].[ext]"}
    ]
  }
/*  tslint: {
    configuration: require('./tslint.json'),
    failOnHint: true,
    tsConfigFile: 'tsconfig.json'
  }*/

};
