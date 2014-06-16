angular.module('retryApp.controllers', [])

.controller('HomeController', function ($scope) {
})
.controller('GuideController', function ($scope) {
})

.controller('SessionsController', function ($scope, SessionsService, $state) {
  // 세션 리스트를 업데이트합니다.
  var refreshList = function () {
    $scope.sessions = null;
    SessionsService.readAll(function (data) {
      $scope.sessions = data;
    });
  };

  refreshList();

  // 새로운 세션을 생성합니다.
  $scope.createSession = function () {

    // AngularJS에서 한글이 제대로 바인딩되지 않아 이 방법을 씁니다.
    var title = $('#title').val();
    var concurrency = $('#concurrency').val();

    var body = {
      title: title,
      concurrency: concurrency 
    };

    SessionsService.create(body, function (err) {
      if (err) {
        return alert('오류가 발생했습니다.');
      }
      refreshList();
    });
  };

  // 세션 세부 정보 상태로 이동합니다.
  $scope.goSession = function (sessionId) {
    $state.go('retry.sessionDetail', { sessionId: sessionId });
  };
})

.controller('SessionDetailController', function ($scope, $cookieStore, $stateParams, SessionsService, $timeout, TicketsService, AttendancesService, RecordsService) {

  // QR 코드 이미지 URL 생성
  // Google에서 제공하는 서비스를 이용합니다.
  var buildQrCodeUrl = function () {
    var template = 'http://chart.apis.google.com/chart?cht=qr&chs=512x512&chl={content}';
    return function (content) {
      return template.replace('{content}', content);    
    };
  }();

  var sessionId = $stateParams.sessionId;
  var userId = $cookieStore.get('userId');
  $scope.sessionTitle = '불러오는 중';

  // 세션 Id에 따라서 세션을 불러옵니다.
  SessionsService.readBySessionId(sessionId, function (data) {
    $scope.sessionId = data.sessionId;
    $scope.sessionTitle = data.title;
    $scope.sessionHostUserName = data.hostUserName;
    $scope.sessionConcurrency = data.concurrency;
    $scope.sessionTimestamp = data.timestamp;
  
    // 이 경우에만 QR 코드를 볼 수 있습니다.
    // 클라이언트에서 스크립트가 강제로 수정될 수 있습니다.
    // 서버에서도 권한을 한 번 더 검사합니다.
    if (userId == data.hostUserId) {
      $scope.isHost = true;

      // 폴링 종료 조건
      var running = true;
      $scope.$on('$destroy', function() {
        running = false;
      });

      // 이미지와 테스트 링크 업데이트
      var updateImage = function (content) {
        $scope.imageUrl = buildQrCodeUrl(content.replace('#', '%23'));
        $scope.codeUrl = content;
      };

      // 폴링 함수
      var refreshTicketImage = function () {
        if (!running) {
          return;
        }

        TicketsService.readLatestTicketBySessionId(sessionId, function (data) {
          updateImage(data.content);
          // 폴링 주기를 0.5초로 설정합니다.
          $timeout(refreshTicketImage, 500);
        });
      };
      refreshTicketImage();
    }
  });

  // 티켓 사용 기록
  AttendancesService.readAllBySessionId(sessionId, function (data) {
    $scope.attendances = data;
  });

  // 출석부
  RecordsService.readAllBySessionId(sessionId, function (data) {
    $scope.records = data;
  });
})

// 아직 제공하는 기능이 없습니다.
.controller('MeController', function ($scope) {
})

.controller('AdminController', function ($scope) {
})

// 스캔 후 메시지 표시
.controller('ScanController', function ($scope, $stateParams, ScansService) {
  var ticketCode = $stateParams.ticketCode;
  $scope.message = '서버와 통신하고 있습니다.';
  ScansService.scan(ticketCode, function (data) {
    $scope.message = data.message;
  });
})
