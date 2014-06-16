angular.module('retryApp.directives',
  [
  ]
)

// 권한에 따라서 메뉴 표시 또는 감추기
.directive('accessLevel', function ($rootScope, AccessControl) {
  return {
    link: function (scope, element, attrs) {
      var prevDisp = element.css('display');
      $rootScope.$watch('userRole', function (userRole) {
        if (!AccessControl.authorize(attrs.accessLevel)) {
          element.css('display', 'none');
        } else {
          element.css('display', prevDisp);
        }
      });
    }
  };
})