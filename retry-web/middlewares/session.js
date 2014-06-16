module.exports = function (app) {
  var config = require('../config');
  var session = require('express-session');
  var SessionStore = require('express-mysql-session');
  app.use(session({
    key: config.sessionKey,
    secret: config.sessionSecret,
    store: new SessionStore(null, app.pool)
    })
  );
};