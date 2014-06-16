module.exports = function (app, db) {
  return {
    // 구현 시간이 부족하여 SQL에서 처리해야 할 내용을 애플리케이션 서버에서 처리합니다.
    // 부하가 큰 환경에서 성능 및 데이터 정합성 문제가 발생할 가능성이 있습니다.
    readAllBySessionId: function (sessionId, cb, conn) {
      var concurrency = null;
      var results = [];
      db.waterfall(conn)
        .then(function (fall) {
          app.models.session.readBySessionId(sessionId, function (err, result) {
            console.log(result);
            if (err) {
              return fall(err);
            }
            concurrency = result.concurrency;
            fall(null);
          }, this);
        })
        .then(function (fall) {
          this.query('SELECT * FROM user', [], function (err, result) {
            fall(null, result);
          });
        })
        .then(function (users, fall) {
          var count = 0;
          var th = this;
          for (var i = 0; i < users.length; i++) {
            !function (i) {
              var userId = users[i].userId;
              app.models.scan.checkAttendedByUserId(userId, sessionId, concurrency, function (err, ok, minTime) {
                count++;
                if (ok) {
                  results.push({
                    timestamp: minTime,
                    userName: users[i].name
                  });
                }
                if (count == users.length) {
                  fall(null);
                }
              }, th);
            }(i);
          }
        })
        .end(function (err, result) {
          cb(null, results);
        });
    }
  }
};