angular.module('retryApp.filters',
  [
  ]
)

// UTC 시각을 지역 시각으로 아름답게 표현
.filter('dateLocal', function () {
  return function (input) {
    return moment(input).format('YYYY-MM-DD HH:mm:ss');
  }
})

// UTC 시각을 지역 시각으로 더 정확하고 아름답게 표현
.filter('dateLocalMicro', function () {
  return function (input) {
    return moment(input).format('YYYY-MM-DD HH:mm:ss.SSS');
  }
})

.filter('trustAsHtml', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
})
.filter('trustAsUrl', function ($sce) {
    return function (val) {
        return $sce.trustAsUrl(val);
    };
})

// 동시성이 0일 경우 무제한으로 표시
.filter('concurrencyFilter', function () {
  return function (val) {
    if (!val) {
      return '무제한';
    }
    return val;
  };
})