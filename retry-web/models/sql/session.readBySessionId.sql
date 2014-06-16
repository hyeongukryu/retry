SELECT

session.sessionId,
session.title,
session.timestamp,
session.concurrency,
user.userId AS hostUserId,
user.name AS hostUserName

FROM session
INNER JOIN user ON user.userId = session.hostUserId
WHERE session.sessionId = ?