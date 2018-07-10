const ExtractTextPlugin = require('extract-text-webpack-plugin');
const theme = require('./theme.json').values;
const postConfig = require('../postcss.config.js');

const cssOption = {
    use: [
        'css-loader',
        'postcss-loader',
        // 'resolve-url-loader',
    ],
    fallback: 'vue-style-loader'
};
const lessOption = {
    use: [
        'css-loader',
        'postcss-loader',
        // {
        //   loader: 'postcss-loader',
        //   options: {
        //     plugins: {
        //       autoprefixer: { browsers:  ['last 3 versions', '> 1%'] },
        //     }
        //   }
        // },
        `less-loader?{modifyVars:${JSON.stringify(theme)}}`
    ],
    fallback: 'vue-style-loader'
};


const scssOption = {
	use: [
	  'css-loader',
	  'postcss-loader',
    // {
    //   loader: 'postcss-loader',
    //   options: postConfig,
    // },
    // 'resolve-url-loader',
	  'sass-loader?outputStyle=expanded'
	],
	fallback: 'vue-style-loader'
};
const sassOption = {
	use: [
	  'css-loader',
	  'postcss-loader',
    // 'resolve-url-loader',
	  'sass-loader?indentedSyntax'
	],
	fallback: 'vue-style-loader'
};

const excludePath = /node_modules\/(?!@(hfe|dp))/;
const isDev = process.env.NODE_ENV !== 'production';
let vueloadRule;
if (isDev) {
  vueloadRule = {
      test: /\.vue$/,
      loader: 'vue-loader',
      exclude: excludePath,
      options: {
          loaders: {
              // 'css': "vue-style-loader!css-loader!postcss-loader",
              // 'less': "vue-style-loader!css-loader!postcss-loader!less-loader",
              'scss': "vue-style-loader!css-loader!postcss-loader!sass-loader",
              'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          }
      }
  };
} else {
  vueloadRule = {
      test: /\.vue$/,
      loader: 'vue-loader',
      exclude: excludePath,
      options: {
          extractCSS: true,
          loaders: {
              'scss': ExtractTextPlugin.extract(scssOption),
              'sass': ExtractTextPlugin.extract(sassOption),
          }
      }
  };
}


const cssloadRule = {
   test: /\.css$/,
   use: ExtractTextPlugin.extract(cssOption)
};
const lessloadRule = {
   test: /\.less$/,
   use: ExtractTextPlugin.extract(lessOption)
};
const scssloadRule = {
   test: /\.scss$/,
   use: ExtractTextPlugin.extract(scssOption)
};

const jsloadRule = {
    test: /\.(es6|js)$/,
    use: [{
        loader: 'babel-loader',
        options: {
            cacheDirectory: isDev
        }
    }],
    exclude: /node_modules\/(?!@(hfe|dp))/
};

const isProd = process.env.NODE_ENV === 'production';
const suffix = isProd ? '.[hash:8]' : '';

const imgloadRule = {
    test: /\.(jpe?g|png|gif|svg)$/i,
    use: [{
        loader: 'url-loader',
        options: {
            limit: 25000,
            name: `images/[name]${suffix}.[ext]`
        }
    }]
}

const fontloadRule = {
    test: /\.woff|ttf|woff2|eot|swf$/,
    use: [{
        loader: 'url-loader',
        options: {
            limit: 100000,
            name: `fonts/[name]${suffix}.[ext]`
        }
    }]
};

module.exports = [ vueloadRule, jsloadRule, lessloadRule, scssloadRule, imgloadRule, fontloadRule ];
