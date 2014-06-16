var crypto = require('crypto');

module.exports = function (app, router, apiHandler) {
  router.get('/sessions', app.ensureAuthorized(app.accessLevels.everyone));
  router.get('/sessions', function (req, res) {
    app.models.session.readAll(apiHandler(req, res));
  });

  router.get('/sessions/:sessionId', app.ensureAuthorized(app.accessLevels.everyone));
  router.get('/sessions/:sessionId', function (req, res) {
    var sessionId = req.params.sessionId;
    app.models.session.readBySessionId(sessionId, apiHandler(req, res));
  });

  router.post('/sessions', app.ensureAuthorized(app.accessLevels.everyone));
  router.post('/sessions', function (req, res) {

    var hostUserId = req.user.userId;
    var title = req.body.title;
    var concurrency = req.body.concurrency;
    var salt = crypto.randomBytes(20).toString('hex');

    app.models.session.create(title, concurrency, salt, hostUserId, apiHandler(req, res));
  });
};