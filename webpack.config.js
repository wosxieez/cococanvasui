const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  const isDev = !isProduction
  
  return {
    mode: argv.mode || 'development',
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    // 开发模式使用 demo.js 作为入口，生产模式使用 src/index.js
    entry: isDev ? './examples/demo.js' : './src/index.js',
    output: {
      filename: isProduction ? 'cocoui.min.js' : 'cocoui.js',
      library: isProduction ? 'CocoUI' : undefined,
      libraryTarget: isProduction ? 'umd' : undefined,
      libraryExport: isProduction ? 'default' : undefined,
      clean: true,
      path: path.resolve(__dirname, 'dist')
    },
    devServer: {
      static: {
        directory: path.join(__dirname, '.')
      },
      compress: true,
      port: 8080,
      hot: true,
      open: true,
      historyApiFallback: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'body'
      })
    ],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  }
}
