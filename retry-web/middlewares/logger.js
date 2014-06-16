module.exports = function (app) {
  var pool = app.pool;
  var development = app.get('env') === 'development';
  app.log = function (category, body) {
    if (!body) {
      body = category;
      category = null;
    }
    body = JSON.stringify(body);
    if (development) {
      console.log(category + ': ' + body);
    }
    pool.query(
      'INSERT INTO log SET ?',
      { category: category, body: body },
      function () {}
    );
  };

  app.log('info', 'app.log를 처음 사용했습니다.');
};