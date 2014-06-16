module.exports = function (app) {

  var async = require('async');
  var fs = require('fs');
  var _ = require('lodash');

  var db = {};
  db.longQuery = function () {
    var args = Array.prototype.slice.apply(arguments);
    return args.join(' ');
  };

  db.sql = function () {
    var cache = {};
    return function (key) {
      if (!cache[key]) {
        cache[key] = fs.readFileSync(__dirname + '/sql/' + key + '.sql', { encoding: 'utf-8' });
      }
      return cache[key];
    }
  }();

  db.waterfall = function (conn, sql, params, cb) {
    if (sql) {
      // then이 하나이고 sql 파일을 사용하는 경우
      return db.waterfall(conn)
        .then(function (fall) {
          this.query(db.sql(sql), params, fall);
        })
        .end(function (err, result) {
          cb(err, result);
        });
    }
    // 복잡한 작업이 필요한 경우
    var functions = [];
    var chain = {
      then: function (func) {
        functions.push(func);
        return chain;
      },
      end: function (callback) {
        db.waterfallEnd(conn, functions, callback);
      }
    };
    return chain;
  };

  db.waterfallEnd = function (conn, functions, callback) {
    // 연결을 여기에서 처음 시작하였는지를 나타냅니다.
    var entry = !conn;

    // 데이터베이스 연결을 두 번째 인자와 this로 받게 됩니다.
    functions = _.map(functions, function (func) {
      return function () {
        var args = Array.prototype.slice.apply(arguments);
        args.push(conn);
        func.apply(conn, args);
      };
    });

    if (entry) {
      async.waterfall(
        _.flatten([
          function (fall) {
            // 연결을 시작합니다.
            app.getConnection(function (err, connection) {
              conn = connection;
              if (err) {
                return fall(err);
              }

              // 트랜잭션 시작
              conn.beginTransaction(function (err) {
                fall(err);
              });
            });
          },

          // 데이터베이스 작업
          functions
        ]),
        function (err, result) {
          if (err) {
            // 트랜잭션 롤백
            return conn.rollback(function () {
              // 연결 반환
              conn.release();
              callback(err, result);
            });
          }

          // 트랜잭션 커밋
          conn.commit(function (err) {
            if (err) {
              // 커밋 실패, 트랜잭션 롤백
              return conn.rollback(function () {
                // 연결 반환
                conn.release();
                callback(err, result);
              });
            }

            // 커밋 성공
            // 연결 반환
            conn.release();
            callback(err, result);
          });
        }
      );
    } else {
      async.waterfall(
        // 데이터베이스 작업
        functions,
        function (err, result) {
          // 여기에서 연결하지 않았으면 넘깁니다.
          callback(err, result);
        }
      );
    }
  };

  // 제외 목록
  var ex = [
    'index.js',
    'sql'
  ];

  var models = {};
  fs.readdirSync(__dirname).forEach(function (file) {
    if (_.contains(ex, file)) {
      return;
    }
    var name = file.substr(0, file.indexOf('.'));
    models[name] = require('./' + name)(app, db);
  });

  models.db = db;
  return models;
};
