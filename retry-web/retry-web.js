// Express 프레임워크
var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');

// 설정 파일입니다.
// 데이터베이스 연결 정보와 Facebook 키가 들어 있는 파일이며, 소스 관리에 포함하지 않습니다.
var config = require('./config');
// 프로덕션 모드인지, 개발 모드인지를 설정합니다.
app.set('env', (config.host == '127.0.0.1') ? 'production' : 'development');
// 프로덕션에서 Nginx 뒤에서 실행하고 있습니다.
app.enable('trust proxy');

// 로거
require('./middlewares/morgan')(app);

// all environments
app.set('views', path.join(__dirname, 'views'));
// Jade를 주 템플릿 엔진으로 사용
var consolidate = require('consolidate');
app.engine('jade', consolidate.jade);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(require('method-override')());

// 기본적으로 세션을 사용하며, 아래에 나열된 것만 쿠키로 전송합니다.
require('./middlewares/cookie')(['userRole', 'csrfToken', 'userName', 'userId'])(app);
require('./middlewares/mysql')(app);
require('./middlewares/session')(app);
// CSRF 방어 미들웨어
app.use(require('csurf')());
// CSRF 토큰을 쿠키로 전송합니다.
app.use(require('./middlewares/csrfCookie')());
// JSON 프리픽스 미들웨어
app.use(require('./middlewares/jsonPrefix')());
// 인증 미들웨어
require('./passport')(app);
// 사용자 인증 정보를 쿠키로 전송합니다.
require('./middlewares/userCookie')(app);

// CSS 대신 Stylus를 사용합니다.
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// 데이터베이스로 로깅
require('./middlewares/logger')(app);
require('./middlewares/accessControl')(app);

// 모델, 컨트롤러 전체 추가
app.models = require('./models')(app);
require('./controllers')(app);

require('./middlewares/errorHandler')(app);

// 서버를 시작합니다.
app.set('port', process.env.PORT || config.port || 8080);
var server = app.listen(app.get('port'), config.host, function () {
  var message = '다시 입력하세요: ' + server.address().port + ' ⓒ 류형욱 2014';
  app.log('info', message);
});
