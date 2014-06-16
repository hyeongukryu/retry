module.exports = function (app) {
  app.use(function (req, res, next) {
    if (req.user && req.user.userRole) {
      req.session.userRole = req.user.userRole;
      req.session.userName = req.user.name;
      req.session.userId = req.user.userId;
    } else {
      req.session.userRole = 0;
      req.session.userName = null;
      req.session.userId = null;
    }
    next();
  });
};
