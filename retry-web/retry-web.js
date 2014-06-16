var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');

var config = require('./config');
app.set('env', (config.host == '127.0.0.1') ? 'production' : 'development');
app.enable('trust proxy');

require('./middlewares/morgan')(app);

// all environments
app.set('views', path.join(__dirname, 'views'));
var consolidate = require('consolidate');
app.engine('jade', consolidate.jade);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(require('method-override')());

require('./middlewares/cookie')(['userRole', 'csrfToken', 'userName', 'userId'])(app);
require('./middlewares/mysql')(app);
require('./middlewares/session')(app);
app.use(require('csurf')());
app.use(require('./middlewares/csrfCookie')());
app.use(require('./middlewares/jsonPrefix')());
require('./passport')(app);
require('./middlewares/userCookie')(app);

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

require('./middlewares/logger')(app);
require('./middlewares/accessControl')(app);

app.models = require('./models')(app);
require('./controllers')(app);

require('./middlewares/errorHandler')(app);

app.set('port', process.env.PORT || config.port || 8080);
var server = app.listen(app.get('port'), config.host, function () {
  var message = '다시 입력하세요: ' + server.address().port + ' ⓒ 류형욱 2014';
  app.log('info', message);
});
