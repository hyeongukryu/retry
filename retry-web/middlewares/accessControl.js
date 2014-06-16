module.exports = function (app) {
  var accessControl = require('../controllers/accessControl');
  app.userRoles = accessControl.userRoles;
  app.accessLevels = accessControl.accessLevels;
  app.ensureAuthorized = function (accessLevel) {
    if (!accessLevel) {
      accessLevel = app.accessLevels.admin;
    }
    return function (req, res, next) { 
      var role = app.userRoles.guest;
      if (req.user && req.user.userRole) {
        role = req.user.userRole;
      }

      if (accessLevel & role) {
        next();
      } else {
        res.send(403);
      }
    };
  };
};