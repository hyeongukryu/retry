module.exports = function (app, db) {
  return {
    readAllBySessionId: function (sessionId, cb, conn) {
      db.waterfall(conn, 'attendance.readAllBySessionId', [sessionId], cb);
    }
  }
};