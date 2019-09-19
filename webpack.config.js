const path = require(`path`);
const MomentLocalePlugin = require(`moment-locales-webpack-plugin`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  plugins: [
    new MomentLocalePlugin({
      localesToKeep: [`es-us`],
    })
  ],
  module: {
    rules: [
      {
        test: /\.css/i,
        use: [`style-loader`, `css-loader`]
      }
    ]
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    publicPath: `http://localhost:8000/`,
    compress: true,
    watchContentBase: true,
    port: 8000
  },
};
