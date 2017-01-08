import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from '../webpack.config.dev';

/* eslint-disable no-console */
new WebpackDevServer(webpack(config),{
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  quiet: false,
  noinfo: false,
  stats: {colors: true},
  historyApiFallback: true,
  proxy: {
    "/api/**": {
      target: "http://localhost:3001/",
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        "^/api": ""
      }
    }
  }
}).listen(3000, 'localhost',function (err, result) {
  if (err) {
    return console.log(err);
  }


  console.log('Listening at http://localhost:3000/');
});
