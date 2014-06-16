angular.module('retryApp.controllers', [])

.controller('HomeController', function ($scope) {
})
.controller('GuideController', function ($scope) {
})

.controller('SessionsController', function ($scope, SessionsService, $state) {
  var refreshList = function () {
    $scope.sessions = null;
    SessionsService.readAll(function (data) {
      $scope.sessions = data;
    });
  };

  refreshList();

  $scope.createSession = function () {

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

  $scope.goSession = function (sessionId) {
    $state.go('retry.sessionDetail', { sessionId: sessionId });
  };
})

.controller('SessionDetailController', function ($scope, $cookieStore, $stateParams, SessionsService, $timeout, TicketsService, AttendancesService, RecordsService) {

  var buildQrCodeUrl = function () {
    var template = 'http://chart.apis.google.com/chart?cht=qr&chs=512x512&chl={content}';
    return function (content) {
      return template.replace('{content}', content);    
    };
  }();

  var sessionId = $stateParams.sessionId;
  var userId = $cookieStore.get('userId');
  $scope.sessionTitle = '불러오는 중';

  SessionsService.readBySessionId(sessionId, function (data) {
    $scope.sessionId = data.sessionId;
    $scope.sessionTitle = data.title;
    $scope.sessionHostUserName = data.hostUserName;
    $scope.sessionConcurrency = data.concurrency;
    $scope.sessionTimestamp = data.timestamp;
  
    if (userId == data.hostUserId) {
      $scope.isHost = true;

      var running = true;
      $scope.$on('$destroy', function() {
        running = false;
      });

      var updateImage = function (content) {
        $scope.imageUrl = buildQrCodeUrl(content.replace('#', '%23'));
        $scope.codeUrl = content;
      };

      var refreshTicketImage = function () {
        if (!running) {
          return;
        }

        TicketsService.readLatestTicketBySessionId(sessionId, function (data) {
          updateImage(data.content);
          $timeout(refreshTicketImage, 500);
        });
      };
      refreshTicketImage();
    }
  });

  AttendancesService.readAllBySessionId(sessionId, function (data) {
    $scope.attendances = data;
  });

  RecordsService.readAllBySessionId(sessionId, function (data) {
    $scope.records = data;
  });
})

.controller('MeController', function ($scope) {
})

.controller('AdminController', function ($scope) {
})

.controller('ScanController', function ($scope, $stateParams, ScansService) {
  var ticketCode = $stateParams.ticketCode;
  $scope.message = '서버와 통신하고 있습니다.';
  ScansService.scan(ticketCode, function (data) {
    $scope.message = data.message;
  });
})
