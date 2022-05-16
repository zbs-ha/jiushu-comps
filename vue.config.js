const path = require('path')
const { IgnorePlugin } = require('webpack')

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: process.env.BASE_URL,

  configureWebpack: {
    plugins: [
      new IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],

    resolve: {
      alias: {
        '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/ui/icons.js'),
      },
    },
  },
}
