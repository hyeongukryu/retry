module.exports = function () {
  return function (req, res, next) {
    if (req.csrfToken) {
      req.session.csrfToken = req.csrfToken();
    }
    next();
  };
};