module.exports = function (app) {
  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;
  var config = require('./config');

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new FacebookStrategy({
      clientID: config.facebookClientID,
      clientSecret: config.facebookClientSecret,
      callbackURL: config.serviceUrl + 'auth/facebook/callback',
      profileURL: 'https://graph.facebook.com/me?locale=ko_KR'
    },
    function (accessToken, refreshToken, profile, done) {
      app.models.user.authenticate(profile, function (err, sessionUser) {
        if (err) {
          done(err);
        } else {
          done(null, sessionUser);
        }
      });
    })
  );

  passport.serializeUser(function (sessionUser, done) {
    done(null, sessionUser);
  });

  passport.deserializeUser(function (sessionUser, done) {
    done(null, sessionUser);
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  app.use(function (req, res, next) {
    next();
  });

  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['user_friends', 'email'] }),
    function (req, res) {
      res.redirect('/');
    }
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  );
};
