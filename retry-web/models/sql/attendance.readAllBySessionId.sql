SELECT

attendance.attendanceId,
attendance.ticketId,
user.name AS userName,
attendance.timestamp

FROM attendance

INNER JOIN user ON user.userId = attendance.userId
WHERE attendance.sessionId = ?
ORDER BY attendance.attendanceId ASC