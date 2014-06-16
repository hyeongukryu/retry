var apiBase = '/api/1/';

angular.module('retryApp.services', ['ngCookies'])

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
