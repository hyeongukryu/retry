module.exports = function (app, db) {
  return {
    readLatestTicketBySessionId: function (sessionId, cb, conn) {
      // 최신 티켓 확인, 없으면 새로 생성, 티켓 ID 넘기기
      // 개수 확인 작업, 모자라면 새로 생성
      // 완성, 티켓 정보 넘기기
    }
  }
};