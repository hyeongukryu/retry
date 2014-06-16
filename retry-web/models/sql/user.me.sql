SELECT
user.name AS name
FROM user
WHERE user.userId = ?
LIMIT 1