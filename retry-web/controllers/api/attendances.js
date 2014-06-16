module.exports = function (app, router, apiHandler) {
  router.get('/attendances', app.ensureAuthorized(app.accessLevels.everyone));
  router.get('/attendances', function (req, res) {
    var sessionId = req.query.sessionId;
    app.models.attendance.readAllBySessionId(sessionId, apiHandler(req, res));    
  });
};