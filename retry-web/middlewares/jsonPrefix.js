module.exports = function () {
  return function (req, res, next) {
    var send = res.send;
    // 아래는 Express의 res.send에 JSON 프리픽스 추가 기능을 더한 것입니다.
    res.send = function (body) {
      if (2 == arguments.length) {
        // res.send(body, status) backwards compat
        if ('number' != typeof body && 'number' == typeof arguments[1]) {
        } else {
          body = arguments[1];
        }
      }
      if (res.get('Content-Type') === 'application/json') {
        body = ")]}',\n" + body;
      }
      send.apply(res, arguments);
    }
    next();
  };
};