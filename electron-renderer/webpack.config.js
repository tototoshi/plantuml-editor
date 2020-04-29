const renderer = {
  entry: "./renderer.js",
  output: {
    filename: "renderer.js",
    path: __dirname + "/../electron-main/dist",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: { node: true } }],
              "@babel/preset-react",
            ],
          },
        },
      },
    ],
  },
  target: "electron-renderer",
  mode: "development",
};

module.exports = renderer;
