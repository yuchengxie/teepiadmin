/*
 * @Description: 
 * @Version: 1.0
 * @Author: xieyucheng
 * @Date: 2021-01-20 16:35:47
 * @LastEditors: xieyucheng
 * @LastEditTime: 2021-01-20 16:37:52
 */
const CompressionPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
module.exports = {
  outputDir: "dist",
  assetsDir: "static",
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  devServer: {
    port: 3000,
    open: true
  },

  css: {
    extract: true,
    sourceMap: false,
    modules: false,
    loaderOptions: {
      sass: {
        // 新版本sass-loader， 将data改成prependData进行配置
        prependData: `@import "@/assets/scss/_variable.scss";`
      }
    }
  },
  chainWebpack: (config) => {
    /* 添加分析工具*/
    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end();
        config.plugins.delete('prefetch')
      }
    }
  },
  // 把webpack的配置写在这里 会自动合并
  configureWebpack: {
    // 以下库使用cdn，不会被打包
    externals: {
      // "vue-router": "VueRouter",
      // "vuex": "Vuex",
      // "vue": "Vue",
      // "axios": "axios",
      // "element-ui": "ElementUI",
      // "echarts": "echarts",
      // "mockjs": "Mock",
      // "ali-oss": "OSS",
      // "moment": "moment"
    }
  },
  // configureWebpack: (config) => {
  //   if (process.env.NODE_ENV === 'production') {
  //     // 为生产环境修改配置...	
  //     config.mode = 'production'
  //     return {
  //       // plugins: [new CompressionPlugin({
  //       //   test: /.js$|.html$|.css/, //匹配文件名	
  //       //   threshold: 10240, //对超过10k的数据进行压缩	
  //       //   deleteOriginalAssets: false //是否删除原文件	
  //       // })]
  //     }
  //   }
  // }
}
