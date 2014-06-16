module.exports = function (app, db) {
  return {
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