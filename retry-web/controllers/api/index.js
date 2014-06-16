module.exports = function (app) {

  // API에 오류가 있으면 오류를 응답하도록
  var apiHandler = function (req, res) {
    return function (err, result) {
      
      // 캐시 금지
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 0);

      if (err) {
        // 거짓 오류로 응답
        res.status(500);
        res.json({
          status: 500,
          message: '오류가 발생했습니다. An error occurred.'
        });
      } else {
        res.json(result);
      }
    };
  };

  var fs = require('fs');
  var express = require('express');
  var router = express.Router();

  fs.readdirSync(__dirname).forEach(function (file) {
    if (file == 'index.js') return;
    var name = file.substr(0, file.indexOf('.'));
    require('./' + name)(app, router, apiHandler);
  });

  // API 버전 1
  app.use('/api/1/', router);
};
