module.exports = function (app) {
  var morgan = require('morgan');
  if (app.get('env') === 'development') {
    app.use(morgan('dev'));
  }
  app.use(morgan({
    stream: {
      write: function (log) {
        app.log('morgan', log);
      }
    }
  }));
};