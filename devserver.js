'use strict';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const open = require('open');
let config = require('./webpack.config.js');
const port = config.devServer.port;

const exclude = [ 'libs', 'vendor' ];
for (let key in config.entry) {
    if (exclude.indexOf(key) === -1) {
      config.entry[key].unshift("webpack-dev-server/client?http://"+'localhost'+":"+port+"/", "webpack/hot/dev-server");
    }
}

config.plugins = config.plugins || [];

new WebpackDevServer(webpack(config), config.devServer)
    .listen(port, '0.0.0.0', (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Listening at localhost:' + port);
        console.log('Opening your system browser...');
        open('http://'+('localhost')+':' + port + '/test.html');
    });
