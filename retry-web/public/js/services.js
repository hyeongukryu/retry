var apiBase = '/api/1/';

angular.module('retryApp.services', ['ngCookies'])

// 서버에서 보내는 userRole 쿠키는 현재 사용자의 권한과 관련이 있습니다.
.factory('AccessControl', function ($cookieStore, $rootScope) {
  $rootScope.$watch(
    function () {
      return $cookieStore.get('userRole');
    },
    function (userRole) {
      $rootScope.userRole = Number(userRole);
    }
  );
  var authorize = function (accessLevel) {
    var userRole = $rootScope.userRole;
    if (!accessLevel && !userRole) {
      return true;
    }
    return userRole & accessControl.accessLevels[accessLevel];
  };
  return {
    authorize: authorize
  };
})

// 아래 서비스들은 서버에서 제공하는 API를 사용합니다.
.factory('SessionsService', function ($http) {
  return {
    create: function (body, cb) {
      $http.post(apiBase + 'sessions', body)
        .success(function (data) {
          cb();
        })
        .error(function () {
          cb(true);
        })
    },
    readAll: function (cb) {
      $http.get(apiBase + 'sessions').success(function (data) {
        cb(data);
      });
    },
    readBySessionId: function (sessionId, cb) {
      $http.get(apiBase + 'sessions/' + sessionId).success(function (data) {
        cb(data);
      });
    }
  };
})

.factory('TicketsService', function ($http) {
  return {
    readLatestTicketBySessionId: function (sessionId, cb) {
      $http.get(apiBase + 'tickets?sessionId=' + sessionId).success(function (data) {
        cb(data);
      });
    }
  }
})

.factory('AttendancesService', function ($http) {
  return {
    readAllBySessionId: function (sessionId, cb) {
      $http.get(apiBase + 'attendances?sessionId=' + sessionId).success(function (data) {
        cb(data);
      });
    }
  }
})

.factory('RecordsService', function ($http) {
  return {
    readAllBySessionId: function (sessionId, cb) {
      $http.get(apiBase + 'records?sessionId=' + sessionId).success(function (data) {
        cb(data);
      });
    }
  }
})

.factory('ScansService', function ($http) {
  return {
    scan: function (ticketCode, cb) {
      $http.post(apiBase + 'scans', {
        ticketCode: ticketCode
      })
        .success(function (data) {
          cb(data);
        })
        .error(function () {
          cb(true);
        })
    }
  }
})
