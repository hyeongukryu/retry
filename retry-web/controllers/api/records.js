module.exports = function (app, router, apiHandler) {
  router.get('/records', app.ensureAuthorized(app.accessLevels.everyone));
  router.get('/records', function (req, res) {
    var sessionId = req.query.sessionId;
    app.models.record.readAllBySessionId(sessionId, apiHandler(req, res));    
  });
};