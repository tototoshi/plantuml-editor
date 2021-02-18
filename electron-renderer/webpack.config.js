const renderer = {
  entry: "./src/renderer.tsx",
  output: {
    filename: "renderer.js",
    path: __dirname + "/../electron-main/dist",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: "electron-renderer",
  mode: "development",
};

module.exports = renderer;
