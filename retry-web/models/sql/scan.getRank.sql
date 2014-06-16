SELECT * FROM
(
SELECT @rn := @rn + 1 AS rank, attendanceId, ticketId, userId, sessionId, timestamp
FROM (
SELECT
attendance.attendanceId,
attendance.ticketId,
attendance.userId,
attendance.sessionId,
attendance.timestamp,
COUNT(*) AS orderCount
FROM attendance
WHERE attendance.ticketId = ?
GROUP BY attendance.attendanceId
ORDER BY attendance.attendanceId ASC, orderCount ASC
) t1, (SELECT @rn := 0) t2
) t3
WHERE attendanceId = ?