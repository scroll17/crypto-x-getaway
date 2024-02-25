const path = require('path');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TSConfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, '..', 'build');
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const STATIC_DIR = path.resolve(__dirname, '..', 'static');

const plugins = [
  new FileManagerPlugin({
    events: {
      // Remove build dir
      onStart: {
        delete: [BUILD_DIR],
      },
      onEnd: {
        // Copy static files
        copy: [
          {
            source: STATIC_DIR,
            destination: BUILD_DIR,
          },
        ],
      },
    },
  }),
  new HtmlWebpackPlugin({
    template: path.join(PUBLIC_DIR, 'index.html'),
    filename: 'index.html',
  }),
  new webpack.HotModuleReplacementPlugin(), // For page reloading
  new Dotenv({
    path: path.resolve(__dirname, '..', '.env')
  })
];

if (process.env.SERVE) {
  plugins.push(new ReactRefreshWebpackPlugin());
}

const devServer = {
  historyApiFallback: true, // Apply HTML5 History API if routes are used
  open: true,
  compress: true,
  allowedHosts: 'all',
  hot: true, // Reload the page after changes saved (HotModuleReplacementPlugin)
  client: {
    // Shows a full-screen overlay in the browser when there are compiler errors or warnings
    overlay: {
      errors: true,
      warnings: true,
    },
    progress: true, // Prints compilation progress in percentage in the browser.
  },

  port: 3000,
  /**
   * Writes files to output path (default: false)
   * Build dir is not cleared using <output: {clean:true}>
   * To resolve should use FileManager
   */
  devMiddleware: {
    writeToDisk: true,
  },
  static: [
    // Required to use favicons located in a separate directory as assets
    // Should use with historyApiFallback, to avoid of 404 for routes
    {
      directory: path.join(BUILD_DIR, 'favicons'),
    },
  ],
};

module.exports = {
  devServer,
  plugins,
  entry: path.join(__dirname, '..', 'src', 'index.tsx'),
  output: {
    path: BUILD_DIR,
    /**
     * Helps to avoid of MIME type ('text/html') is not a supported stylesheet
     * And sets address in html imports
     */
    // publicPath: "./build",
  },
  // Checking the maximum weight of the bundle is disabled
  performance: {
    hints: false,
  },
  // Modules resolved
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TSConfigPathsWebpackPlugin({
        configFile: path.join(__dirname, '../', 'tsconfig.json'),
        logLevel: 'info',
      }),
    ],
  },
  module: {
    strictExportPresence: true, // Strict mod to avoid of importing non-existent objects

    rules: [
      // --- JS | TS USING BABEL
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true, // Using a cache to avoid of recompilation
          },
        },
      },
      // --- HTML
      { test: /\.(html)$/, use: ['html-loader'] },
      // --- S/A/SS
      {
        test: /.(s[ac])ss$/i,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // translates css into CommonJS
            options: {
              esModule: true,
              // css modules
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]', // format of output
                namedExport: true, // named exports instead of default
              },
            },
          },
          {
            // autoprefixer
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // --- IMG
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[hash][ext]',
        },
      },
      // --- FONTS
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        exclude: /node_modules/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext]',
        },
      },
    ],
  },
};
