var UglifyJS = require("uglify-js");

module.exports = function (app, router) {
  router.get('/', function (req, res) {
    res.render('root.jade');
  });

  var accessControl = UglifyJS.minify('controllers/accessControl.js').code;
  router.get('/js/accessControl.js', function (req, res) {
    res.header('Content-Type', 'application/javascript');
    res.send(accessControl);
  });
};
