const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const loadRules = require('./config/loadRules');
//DllPlugin动态链接库（dll）,分离第三方库和业务代码
//一个 dll 包，就是一个很纯净的依赖库，它本身不能运行，是用来给你的 app 或者业务代码引用的
//使用方法 1> 打包ddl包,DllPlugin 2> 引用ddl包，打包业务代码,DllReferencePlugin
const entry = {};
entry.libs = [ 'vue'];//add the third party library which you want seperate
entry.vendor = ['fastclick', 'promise', 'whatwg-fetch', './src/libs/api'];

const relativePath = './dist/static';
const isProd = process.env.NODE_ENV === 'production';
const jsSuffix = isProd ? '.[chunkHash:8]' : '';
const cssSuffix = isProd ? '.[contenthash:8]' : '';

var suffix = '';
var plugins = [];
if (process.env.NODE_ENV === 'production') {
  suffix = '.[chunkHash:8]';
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
}
module.exports = {
    entry: entry,
    output: {
        filename: `[name]${suffix}.js`,
        path: path.join(__dirname, relativePath),
        library: '[name]_lib'
    },
		module: {
        rules: loadRules,
        noParse: [/\.min\.js$/]
    },
    plugins: [
        new CleanWebpackPlugin(['../dist'], {
            root: path.join(__dirname),
            verbose: true,
            dry: false
        }),

				new ExtractTextPlugin({
	          filename: `[name]${cssSuffix}.css`,
	          disable: false,
	          allChunks: true
	      }),
        new webpack.DllPlugin({
            path: path.join(__dirname, relativePath, '[name]-manifest.json'),
            name: '[name]_lib',
            context: __dirname
        })
    ].concat(plugins)
}
