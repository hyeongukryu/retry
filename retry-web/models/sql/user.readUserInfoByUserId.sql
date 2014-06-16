SELECT

facebookAccountId,
user.userId,
user.name AS userName

FROM facebook_account
INNER JOIN user ON facebook_account.userId = user.userId
WHERE user.userId = ?
LIMIT 1