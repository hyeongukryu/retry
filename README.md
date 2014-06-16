다시 입력하세요: 전자 출결 시스템
==========================

이 파일은 프로젝트의 문서입니다.

### License
GNU General Public License v3

### 공개 서비스 중
http://retry.bluherbsoft.com/

### 프로덕션 서버 구성
* Nginx 리버스 프록시
* Nodejs 0.10.28
* MariaDB

### 의존성
* AngularJS
* Bootstrap
* jQuery
* Express
* morgan
* express-session
* express-mysql-session(이전 버전을 fork하여 수정함)
* 여러 Connect 및 Express 제공 미들웨어
* Jade
* Stylus
* Passport
* async
* lodash
* uglify-js
* node-mysql
* csurf
* Moment.js
* AngularUI Bootstrap

### 설정 파일 제외
데이터베이스 연결 설정, 세션 키, Facebook 앱 정보가 지정되는 config.js는 소스 관리에서 제외합니다.

### 소스 코드 설명
대부분의 소스 코드에 상세한 주석이 있습니다.

### 서버 구성
MVC 구조로 이루어져 있습니다. 컨트롤러는 얇게 설계하였습니다. 퍼시스턴스를 수행하는 코드 부분은 타 프로젝트에 사용하여 일정 수준 이상 검증된 코드입니다. 뷰 및 partial 뷰는 서버에서 Jade로 렌더링하여 클라이언트에 제공됩니다.

### 클라이언트 구성
AngularJS를 사용하는 싱글 페이지 애플리케이션입니다. 서버와의 통신은 JSON을 사용하는 RESTful API로 합니다. 보안을 위해 CSRF 토큰 및 JSON 프리픽스를 사용합니다.

### 개선 사항, 추가 기능 계획
* 구현 시간이 부족하여, 최적화된 SQL 질의로 출석 판정을 수행하지 않고, 서버 애플리케이션 단에서 반복적인 질의를 수행하고 결과를 분석하는 것으로 해결하고 있습니다.
* 폴링 이외의 방법으로 서버 푸시할 수 있는 기능을 제공합니다.
* 미리 녹음된 음성 안내 기능을 제공합니다.
* 미리 녹음하지 않고 TTS를 사용하여 사용자의 이름을 부르는 기능을 제공합니다.
* Facebook 친구 수와 같은 정보를 이용하여 실제 사용하는 활성 계정인지 확인합니다.
