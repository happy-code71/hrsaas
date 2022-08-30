'use strict'
const path = require('path')
// const { config } = require('process')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// cdn 地址
let cdn = { css: [], js: [] }

let externals = {}
// 只有在生产环境的时候，才需要使用webpack 排除包
if (process.env.NODE_ENV === 'production') {// 判断是否为生产环境
  // webpack 排除打包
  // 我们这么做的目的是，不希望这些包，打包到服务器上
  // 但是，在项目中对这些包的依赖很大，
  // 我们虽然不打包这些包到服务器，但是我们还希望项目能完整运行，只是换一种方式引入这些包
  // 所以，externals 中的键值对： key(排除的包):value(排除的包的全局变量)
  // 排除的包的全局变量:因为我们最终还是需要引入这些包的，我们只是换了一种方式引入
  // 这种方式就是cdn  ,这样性能会提升很多

  externals = {
    // key(包名) / value(这个值 是 需要在CDN中获取js, 相当于 获取的js中 的该包的全局的对象的名字)
    'vue': 'Vue',// 后面的名字不能随便起 应该是 js中的全局对象名
    'element-ui': 'ELEMENT', // 都是js中全局定义的
    'xlsx': 'XLSX', // 都是js中全局定义的
  }
  // cdn 地址赋值
  // 这样做的目的是方便将这些地址注入inedx.html 中
  // 在index.html 中引入这些地址，代替包
  // 对应了上面的全局变量
  cdn = {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css' // 提前引入elementUI样式
    ], // 放置css文件目录
    js: [
      'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',// vuejs
      'https://cdn.bootcss.com/element-ui/2.13.2/index.js', // element
      'https://cdn.bootcdn.net/ajax/libs/xlsx/0.14.5/xlsx.full.min.js', // xlsx 相关
      'https://cdn.jsdelivr.net/npm/xlsx@0.14.5/dist/jszip.min.js' // xlsx 相关
    ] // 放置js文件目录
  }
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://ihrm.itheima.net/',
        changeOrigin: true
      }
    },
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    devtool: "source-map",
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals: externals
  },
  chainWebpack(config) {

    // 通过 `html-webpack-plugin`注入到 `index.html`之中:
    config.plugin('html').tap(args => {
      args[0].cdn = cdn
      return args
    })

    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
