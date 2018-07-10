"use strict";
var os = require('os');
var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

var STATIC_SRC = require("./f2eci")["static-src"];
var DIST_PATH = require('./f2eci').dist;
var HTML_PATH = require('./f2eci').output;
var PUBLIC_PATH = require('./f2eci').urlPrefix;

var loadRules = require('./config/loadRules');
var postConfig = require('./postcss.config');
var Util = require('./config/util');

var alias = {
  vue: 'vue/dist/vue.min.js',
  '@components': path.join(__dirname, './src/components'),
}

var isProd = process.env.NODE_ENV === 'production';

var plugins = [];
if (isProd) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
      exclude:/\.min\.js$/,
      sourceMap: 'source-map',
      mangle: {
        except: ['$','jQuery']
      },
  		compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        drop_debugger: true,
        drop_console: true,
      },
      output: {
        comments: false
      },
      except:['exports', 'require']
  }));

  plugins.push(new webpack.optimize.AggressiveMergingPlugin());
  // plugins.push(new InlineManifestWebpackPlugin());
  plugins.push(new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }));
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

var htmlPlugins = [];
var htmlMinify = isProd ? {
  minifyJS: true,
  minifyCSS: true,
  collapseWhitespace: true,
  removeComments: true
} : false;

var htmlPath = '';
var list = '*';
var entry = glob.sync('./src/' + list + '/index.js').reduce(function (prev, curr) {
    var key = curr.slice(6, -9);
    var chunks = [key+'.min'];
    htmlPlugins.push(new HtmlWebpackPlugin({
      template: `./html/index.html`,
      filename: `${htmlPath}${key}.html`,
      chunks,
    }));
    prev[key+'.min'] = [path.resolve(__dirname, curr)];
    return prev;
}, {});

//DllReferencePlugin 配置文件
Util.execDll(function(manifests) {
  for (var i = 0; i < manifests.length; i++) {
    console.log(manifests[i]);
    plugins.push(
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require(manifests[i])
      })
    );
  }
});

var jsSuffix = isProd ? '.[chunkHash:8]' : '';
var cssSuffix = isProd ? '.[contenthash:8]' : '';

module.exports = {
    entry: entry,
    output: {
        filename: `[name]${jsSuffix}.js`,
        path: path.join(__dirname, DIST_PATH),
        publicPath: PUBLIC_PATH,
    },
    devtool: isProd ? 'source-map' : 'eval',
    resolve: {
        alias: alias,
        modules: [path.resolve(__dirname, 'node_modules')],
        extensions: ['.js', '.es6', '.json', '.jsx', '.vue']
    },
    module: {
        rules: loadRules,
        noParse: [/\.min\.js$/]
    },
    target: "web",
    plugins: [
      new webpack.ProgressPlugin(),
      new webpack.LoaderOptionsPlugin({
          minimize: isProd,
          options: {
            context: __dirname,
          }
      }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      }),
      new webpack.NamedModulesPlugin(),
      new ExtractTextPlugin({
          filename: `[name]${cssSuffix}.css`,
          disable: false,
          allChunks: true
      }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   names: ['manifest', 'libs', 'vendor'].reverse(),
      //   filename: `[name]${jsSuffix}.js`
      // }),
    ].concat(plugins).concat(htmlPlugins),
    bail: isProd,
    devServer: {
      contentBase: DIST_PATH,
      historyApiFallback: false,
      hot: false,
      inline: true,
      // watchContentBase: true,
      port: 5000,
      publicPath: PUBLIC_PATH,
      noInfo: false,
      compress: false,
      proxy: {
        '/api/**': {
          target: 'http://xx.com/',
          changeOrigin: true,
          secure: false,
          pathRewrite: {'^/api' : ''}
        }
      },
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        colors: {
          green: '\u001b[32m',
        }
      },
    },
};
