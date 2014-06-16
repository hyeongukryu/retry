module.exports = function (app, db) {
  return {
    // 구현 시간이 부족하여 SQL에서 처리해야 할 내용을 애플리케이션 서버에서 처리합니다.
    // 부하가 큰 환경에서 성능 및 데이터 정합성 문제가 발생할 가능성이 있습니다.
    checkAttendedByUserId: function (userId, sessionId, concurrency, cb, conn) {
      var minTime = null;
      db.waterfall(conn)
        // 모든 시도 구하기
        .then(function (fall) {
          this.query('SELECT * FROM attendance WHERE userId = ? AND sessionId = ? ORDER BY attendance.timestamp ASC', [userId, sessionId], function (err, result) {
            if (err) {
              return fall(err);
            }
            fall(null, result);
          });
        })
        // 순회하면서 rank 구하기
        .then(function (attendances, fall) {
          var count = 0;
          var ok = false;
          var th = this;
          
          var minI = 987654321;

          if (attendances.length == 0) {
            return fall(null, false);
          }
          for (var i = 0; i < attendances.length; i++) {
            !function (i) {
              var attendanceId = attendances[i].attendanceId;
              var ticketId = attendances[i].ticketId;
              th.query(db.sql('scan.getRank'), [ticketId, attendanceId], function (err, result) {
                count++;
                var currentOk = false;
                if (!err && !concurrency) {
                  currentOk = true;
                }
                else if (!err && result[0] && result[0].rank && result[0].rank <= concurrency) {
                  currentOk = true;
                }
                if (currentOk) {
                  ok = true;
                  if (minI > i) {
                    minI = i;
                    minTime = attendances[i].timestamp;
                  }
                }

                if (count == attendances.length) {
                  fall(null, ok);
                }
              });
            }(i);
          }
        })
        .end(function (err, result) {
          return cb(err, result, minTime);
        });
    },
    scan: function (userId, ticketCode, cb, conn) {
      var ticketId = ticketCode;
      var attended = false;
      var limit = false;
      var sessionId = 0;
      var concurrency = null;

      db.waterfall(conn)
        // 세션 번호 구하기
        .then(function (fall) {
          this.query('SELECT ticket.sessionId FROM ticket WHERE ticket.ticketId = ? LIMIT 1', [ticketId], function (err, result) {
            console.log(result);
            if (err) {
              return fall(err);
            }
            sessionId = result[0].sessionId;
            fall(null);
          });
        })
        // 세션 동시성 구하기
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
        // 이미 출석한 것으로 처리되었는지 검사
        .then(function (fall) {
          app.models.scan.checkAttendedByUserId(userId, sessionId, concurrency, function (err, result) {
            console.log(result);
            if (err) {
              return fall(err);
            }
            if (result) {
              attended = true;
            }
            fall(null);
          }, this);
        })
        // 티켓 초과 사용 검사
        .then(function (fall) {
          this.query(db.sql('attendance.getCountByTicketId'), [ticketId], function (err, result) {
            console.log(result);
            if (err) {
              return fall(err);
            }
            var count = result[0].count;
            if (concurrency != 0 && count >= concurrency) {
              limit = true;
            }
            fall(null);
          });
        })
        // 출석 여부에 상관없이 추가
        .then(function (fall) {
          var attendance = {
            userId: userId,
            ticketId: ticketId
          };
          this.query('INSERT INTO attendance SET ?, timestamp = NOW()', attendance, function (err, result) {
            if (err) {
              return fall(err);
            }
            fall(null);
          });
        })
        .end(function (err, result) {
          if (attended) {
            cb(null, { message: '이미 출석하였습니다.'});
          } else {
            if (limit) {
              cb(null, { message: 'QR 코드 사용 제한을 초과하였습니다.'});
            } else {
              cb(null, { message: '출석에 성공했습니다.'});
            }
          }
        });
    }
  }
};