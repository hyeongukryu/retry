module.exports = function (app) {
  var config = require('../config');
  var mysql = require('mysql');
  var pool = app.pool = mysql.createPool(config.persistence);
  app.getConnection = function (callback) {
    pool.getConnection(function (err, conn) {
      callback(err, conn);
    });
  };
};