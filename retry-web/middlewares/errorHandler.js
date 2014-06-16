module.exports = function (app) {
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development only
  if ('development' == app.get('env')) {
    app.locals.pretty = true;
    app.use(function (err, req, res, next) {
      if (!err) {
        err = {};
      }
      if (!err.status) {
        err.status = 500;
      }
      if (!err.message) {
        err.message = '서버 오류';
      }
      res.status(err.status);
      res.render('error.jade', {
        message: err.message,
        error: err
      });
    });
  } else {
    // 프로덕션
    app.use(function (err, req, res, next) {
      if (!err) {
        err = {};
      }
      if (!err.status) {
        err.status = 500;
      }
      if (!err.message) {
        err.message = '서버 오류';
      }
      err = {
        message: err.message,
        status: err.status
      };
      res.status(err.status);
      res.render('error.jade', {
        message: err.message,
        error: err
      });
    });
  }
};