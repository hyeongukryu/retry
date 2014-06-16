var config = require('../config');

module.exports = function (app, db) {
  return {
    readLatestTicketBySessionId: function (sessionId, cb, conn) {
      var concurrency = null;

      db.waterfall(conn)
        // 세션 동시성 구하기
        .then(function (fall) {
          app.models.session.readBySessionId(sessionId, function (err, result) {
            if (err) {
              return fall(err);
            }
            concurrency = result.concurrency;
            fall(null);
          }, this);
        })
        // 최신 티켓 확인, 없으면 새로 생성, 결과는 ticketId
        .then(function (fall) {
          var th = this;
          this.query(db.sql('ticket.getLatestBySessionId'), [sessionId], function (err, result) {
            if (err) {
              return fall(err);
            }
            if (result.length == 0) {
              var ticket = {
                sessionId: sessionId
              };
              th.query('INSERT INTO ticket SET ?', ticket, function (err, result) {
                if (err) {
                  return fall(err);
                }
                fall(null, result.insertId);
              });
            } else {
              fall(null, result[0].ticketId);
            }
          });
        })
        // 사용 내역 개수 확인 작업, 모두 사용하였으면 새로 생성
        .then(function (ticketId, fall) {
          var th = this;
          this.query(db.sql('attendance.getCountByTicketId'), [ticketId], function (err, result) {
            if (err) {
              return fall(err);
            }
            var count = result[0].count;
            if (concurrency != 0 && count >= concurrency) {
              var ticket = {
                sessionId: sessionId
              };
              th.query('INSERT INTO ticket SET ?', ticket, function (err, result) {
                if (err) {
                  return fall(err);                  
                }
                fall(null, result.insertId);
              });
            } else {
              fall(null, ticketId); 
            }
          });
        })
        // 완성, 결과는 티켓 번호와 인증 코드
        .end(function (err, result) {
          if (err) {
            return cb(err);
          }
          cb(null, { content: config.serviceUrl + '#/scan/' + result });
        });
    }
  }
};