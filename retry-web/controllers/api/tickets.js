var crypto = require('crypto');

module.exports = function (app, router, apiHandler) {
  router.get('/tickets', app.ensureAuthorized(app.accessLevels.everyone));
  router.get('/tickets', function (req, res) {
    var userId = req.user.userId;
    var sessionId = req.body.sessionId;

    
    // 사용자 id 검사

    // get Scheme 검사
  });
};