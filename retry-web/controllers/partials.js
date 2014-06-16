module.exports = function (app, router) {
  var env = app.get('env');
  router.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name + '.jade', { env: env });
  });
};