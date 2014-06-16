module.exports = function (app) {
  // 클라이언트에서 알아야 할 사용자 정보를 쿠키로 보냅니다.
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
