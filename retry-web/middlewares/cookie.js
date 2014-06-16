module.exports = function (keys) {
  var cookie = require('cookie');
  var _ = require('lodash');

  return function (app) {
    app.use(function (req, res, next) {
      var addHeader = function (name, val) {
        var prev = res.get(name);
        if (prev) {
          if (Array.isArray(prev)) {
            val = prev.concat(val);
          } else {
            val = [prev, val];
          }
        }
        res.set(name, val);
      };
      var addCookie = function (name, val) {
        var headerVal = cookie.serialize(name, String(val), {
          path: '/',
          httpOnly: false
        });
        if (val === null) {
          headerVal = cookie.serialize(name, '', {
            path: '/',
            httpOnly: false,
            expires: new Date(0)
          });
        }
        addHeader('Set-Cookie', headerVal);
      };
      var writeHead = res.writeHead;
      res.writeHead = function () {
        _.forEach(_.keys(req.session), function (key) {
          if (_.contains(keys, key)) {
            addCookie(key, req.session[key]);
          }
        });
        writeHead.apply(res, arguments);
      };
      next();
    });
  };
};