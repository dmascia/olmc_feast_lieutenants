"use strict";

const passport = require('passport'),
      Strategy = require('passport-local').Strategy,
      db = require('./../models');

passport.use(new Strategy(
  (username, password, done) => {

    db.Users.findOne({
      where: { username: username },
    })
    .then( userResult => {

      if (userResult === null) {

        throw new Error("no user found");
      }

      if (userResult.enabled === 0) {

        throw new Error("account is not allowed to login");
      }

      return db.Users.verifyPassword(userResult.dataValues, password);
    })
    .then( passwordResult => {

      if (passwordResult.match) {
        return done(null, passwordResult.user);
      }

      return done(null, false);
    })
    .catch( error => {

      console.log("PASSPORT ERROR", error);

      return done(null, false);
    });
  })
);

passport.serializeUser( (user, done) => {

  return done(null, user.id);
});

passport.deserializeUser( (userID, done) => {

  db.Users.findById(userID, {
      attributes: ['id', 'roles', 'firstname', 'lastname']
    })
    .then( userResult => {

      if (!userResult) {

        return done(null, false);
      }

      return done(null, userResult.dataValues);
    })
    .catch( error => {

      return done(error);
    });
});

module.exports = passport;
