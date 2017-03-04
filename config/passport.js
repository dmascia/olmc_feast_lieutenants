"use strict";

const passport = require('passport'),
      Strategy = require('passport-local').Strategy,
      db = require('./../app/models');

passport.use(new Strategy(
  (username, password, done) => {

    db.Users.findOne({
      where: { username: username }
    })
    .then( userResult => {

      if (!userResult) {

        return done(null, false);
      }

      return db.Users.verifyPasword(userResult.dataValues, password);
    })
    .then( passwordResult => {

      if (passwordResult.match) {
        return done(null, passwordResult.user);
      }

      return done(null, false);
    })
    .catch( error => {
      return done(error, null);
    });
  })
);

passport.serializeUser( (user, done) => {

  return done(null, user.id);
});

passport.deserializeUser( (userID, done) => {

  db.Users.findById(userID)
    .then( userResult => {

      if (!userResult) {

        return done(null, false);
      }

      return done(null, userResult);
    })
    .catch( error => {

      return done(error);
    });
});

module.exports = passport;
