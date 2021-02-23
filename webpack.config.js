const path = require('path');
const webpack = require('webpack');
const glob = require('glob-all');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cwd = process.cwd();

const entry = glob.sync(['./src/views/**/*.html']).reduce((obj, item) => {
  const chunk = item
    .replace(/\\/g, '/')
    .replace(/^\.?\/?src\/views\//, '')
    .replace(/\.\w+$/, '');
  obj[chunk] = item.replace(/\.html$/, '.ts');
  return obj;
}, {});

console.info('entry:', entry);

module.exports = {
  mode: 'development',
  entry,
  output: {
    path: path.join(cwd, 'output'),
    filename: 'public/[name].[contenthash].bundle.js',
    assetModuleFilename: 'public/[hash][ext][query]',
    publicPath: '/',
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({ filename: 'public/main.[contenthash].css' }),
    ...Object.keys(entry).map((chunk) => {
      const main = entry[chunk];
      return new HtmlWebpackPlugin({
        filename: `views/${chunk}.html`,
        template: main.replace(/\.(ts|js)$/, '.html'),
        chunks: [chunk],
      });
    }),
  ],

  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            /* exclude: [/views/],
            options: {
              interpolate: 'require', // supported html `${}` sytax
              attrs: [ ':src' ],
            }, */
          },
          /* {
            loader: require.resolve('./loaders/nunjucks-loader'),
          }, */
        ].filter(item => item),
      },
      {
        test: /\.(png|svg|jpe?g|bmp|gif|ico)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: [/node_modules/],
      },
      {
        test: /.(less|css)$/,
        include: [path.join(cwd, 'src/assets')],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',

            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',

            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@": path.join(cwd, "src")
    }
  },

  devServer: {
    open: true,
    host: 'localhost',
    contentBase: path.join(cwd, 'src/views'),
  },
};
