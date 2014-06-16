module.exports = function (app) {
  var fs = require('fs');
  var _ = require('lodash');
  var express = require('express');
  var router = express.Router();

  // 제외 목록
  var ex = [
    'index.js',
    'api',
    'accessControl.js'
  ];

  fs.readdirSync(__dirname).forEach(function (file) {
    if (!_.contains(ex, file)) {
      var name = file.substr(0, file.indexOf('.'));
      require('./' + name)(app, router);
    }
  });

  // API에 속하지 않는 controllers
  app.use('/', router);

  // API를 구성하는 controllers
  require('./api')(app);
};