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

.factory('TicketService', function ($http) {
  return {
    readLatestTicketBySessionId: function (body, cb) {
      $http.get(apiBase + 'tickets').success(function (data) {
        cb(data);
      });
    }
  }
})