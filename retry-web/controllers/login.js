module.exports = function (app, router) {
  router.get('/login', function (req, res) {
    if (req.user) {
      res.render('error.jade',
        {
          message: '로그인 작업을 수행하려면 먼저 로그아웃을 해야 합니다.'
        }
      );
    } else {
      res.render('login.jade');
    }
  });
};