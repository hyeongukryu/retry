module.exports = function (app, router, apiHandler) {
  router.post('/scans', app.ensureAuthorized(app.accessLevels.everyone));
  router.post('/scans', function (req, res) {

    var userId = req.user.userId;
    var ticketCode = req.body.ticketCode;

    app.models.scan.scan(userId, ticketCode, apiHandler(req, res));
  });
};