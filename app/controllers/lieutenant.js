"use strict";

const express = require('express'),
      router = express.Router(),
      db = require('./../models'),
      crypto = require('crypto');

module.exports = (app, passport, ensureLogin, isAuthorized) => {

  app.use('/lieutenant', router);

  router.post('/',
    ensureLogin.ensureLoggedIn('/'),
    isAuthorized('ADMIN'),
    (req, res) => {

      if (req.body.password !== req.body.verifyPassword) {

        return res.status(400).send("passwords do not match");
      }

      const salt = crypto.randomBytes(20).toString('hex');
      const hashedPassword = crypto.createHash('md5')
        .update(`${salt}${req.body.password}`)
        .digest('base64');

      const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        username_canonical: req.body.username,
        email: req.body.email,
        email_canonical: req.body.email,
        enabled: true,
        salt: salt,
        password: hashedPassword,
        locked: false,
        roles: "LIEUTENANT"
      };

      db.Users.create(user)
        .then( createUserResult => {

          if (!createUserResult) {

            req.flash("error", "Could not save Lieutenant");
            return res.redirect('/admin/');
          }

          req.flash("success", `Lieutenant ${user.firstname} ${user.lastname} has been created!`);
          return res.redirect('/admin/');
        })
        .catch( error => {

          console.error("LIEUTENANT CREATION ERROR", error);
          req.flash("error", "Could not save Lieutenant");
          return res.redirect('/admin/');
        });
  });

};
