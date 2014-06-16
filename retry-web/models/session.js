module.exports = function (app, db) {
  return {
    readAll: function (cb, conn) {
      db.waterfall(conn, 'session.readAll', [], cb);
    },
    create: function (title, concurrency, salt, hostUserId, cb, conn) {
      db.waterfall(conn)
        .then(function (fall) {
          var body = {
            title: title,
            concurrency: concurrency,
            salt: salt,
            hostUserId: hostUserId
          };
          this.query('INSERT INTO session SET ?, timestamp = NOW()', body, fall);
        })
        .end(function (err, result) {
          if (err) {
            return cb(err);
          }
          cb(null);
        });
    },
    readBySessionId: function (sessionId, cb, conn) {
      db.waterfall(conn, 'session.readBySessionId', [sessionId], function (err, result) {
        if (err) {
          return cb(err);
        }
        if (result.length != 1) {
          return cb(true);
        }
        cb(null, result[0]);
      });
    }
  }
};