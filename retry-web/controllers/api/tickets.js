var crypto = require('crypto');

module.exports = function (app, router, apiHandler) {
  router.get('/tickets', app.ensureAuthorized(app.accessLevels.everyone));
  router.get('/tickets', function (req, res) {
    var userId = req.user.userId;
    var sessionId = req.query.sessionId;

    app.models.session.readBySessionId(sessionId, function (err, result) {
      if (err || (result.hostUserId != userId)) {
        // 세션 번호가 잘못되었거나 적절한 권한이 없는 사용자
        return apiHandler(req, res)(true, null);
      }
      app.models.ticket.readLatestTicketBySessionId(sessionId, apiHandler(req, res));
    });
  });
};