var _ = require('lodash');

module.exports = function (app, db) {

  // 류형욱
  // 스코프가 앱 단위로 되어 있는 사용자 Id이므로 공개되어도 큰 문제 없습니다.
  var adminList = [751678611541597];

  return {
    readUserInfoByUserId: function (userId, cb, conn) {
      db.waterfall(conn)
        .then(function (fall, conn) {
          conn.query(db.sql('user.readUserInfoByUserId'), [userId], fall);
        })
        .end(function (err, result) {
          if (err) {
            cb(err);
          } else {
            if (result.length) {
              cb(null, result[0]);
            } else {
              cb(null, null);
            }
          }
        });
    },

    readUserInfoByProfile: function (profile, cb, conn) {
      db.waterfall(conn)
        .then(function (fall, conn) {
          conn.query(db.sql('user.readUserInfoByProfile'), [profile.id], fall);
        })
        .end(function (err, result) {
          if (err) {
            cb(err);
          } else {
            if (result.length) {
              cb(null, result[0]);
            } else {
              cb(null, null);
            }
          }
        });
    },

    createUser: function (name, cb, conn) {
      db.waterfall(conn)
        .then(function (fall, conn) {
          conn.query('INSERT INTO user SET ?', { name: name }, fall);
        })
        .end(function (err, result) {
          if (err) {
            cb(err);
          } else {
            cb(null, result.insertId);
          }
        });
    },

    createFacebookAccount: function (profile, userId, cb, conn) {
      db.waterfall(conn)
        .then(function (fall, conn) {
          conn.query(
            'INSERT INTO facebook_account SET ?',
            {
              facebookAccountId: profile.id,
              displayName: profile.displayName,
              detail: JSON.stringify(profile),
              userId: userId
            },
            fall
          );
        })
        .end(function (err, result) {
          if (err) {
            cb(err);
          } else {
            cb(null, profile.id);
          }
        });
    },

    // 사용자 가입 및 인증 작업을 수행합니다.
    // Facebook 계정과 관련이 있는 사용자가 없으면 자동으로 생성합니다.
    authenticate: function (profile, cb, conn) {
      db.waterfall(conn)
        .then(function (fall, conn) {
          app.models.user.readUserInfoByProfile(profile, fall, conn);
        })
        .then(function (userInfo, fall, conn) {
          if (userInfo) {
            // 사용자 및 Facebook 계정이 있는 경우
            fall(null, userInfo);
          } else {
            // 사용자 추가
            app.models.user.createUser(profile.displayName,
              function (err, userId) {
                if (err) {
                  // 사용자 추가 실패
                  fall(err);
                } else {
                  // Facebook 계정 추가
                  app.models.user.createFacebookAccount(
                    profile, userId,
                    function (err) {
                      if (err) {
                        fall(err);
                      } else {
                        // 모두 성공, 사용자 정보를 넘깁니다.
                        app.models.user.readUserInfoByProfile(profile, fall, conn);
                      }
                    },
                    conn
                  );
                }
              },
              conn
            );
          }
        })
        .then(function (userInfo, fall, conn) {
          
          var sessionUser = {};

          // 회원
          sessionUser.userRole = app.userRoles.user;

          if (_.contains(adminList, userInfo.facebookAccountId)) {
            // 관리자
            sessionUser.userRole = app.userRoles.admin;
          }

          sessionUser.name = userInfo.userName;
          sessionUser.userId = userInfo.userId;

          fall(null, sessionUser);
        })
        .end(function (err, result) {
          cb(err, result);
        });
    },

    me: function (userId, cb, conn) {
      db.waterfall(conn)
        .then(function (fall, conn) {
          conn.query(db.sql('user.me'), [userId], fall);
        })
        .end(function (err, result) {
          if (result.length) {
            var user = result[0];
            cb(err, user);
          } else {
            cb(true);
          }
        });
    }
  };
};
