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

      const lieutenant = {
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

      db.Users.create(lieutenant)
        .then( createUserResult => {

          if (!createUserResult) {

            req.flash("error", "Could not save Lieutenant");
            return res.redirect('/admin/');
          }

          req.flash("success", `Lieutenant ${lieutenant.firstname} ${lieutenant.lastname} has been created!`);
          return res.redirect('/admin/');
        })
        .catch( error => {

          console.error("LIEUTENANT CREATION ERROR", error);
          req.flash("error", "Could not save Lieutenant");
          return res.redirect('/admin/');
        });
  });

  router.post('/:lieutenantId/update',
    ensureLogin.ensureLoggedIn('/'),
    isAuthorized('ADMIN'),
    (req, res) => {

      const lieutenant = req.body;
      const lieutenantId = req.params.lieutenantId;

      db.Users.update( lieutenant,
        { where: { id: lieutenantId } }
      )
      .then( updateResult => {

        if (!updateResult) {

          req.flash("error", "Could not update Lieutenant");
          return res.redirect('/admin/');
        }

        req.flash("success", `Lieutenant ${lieutenant.firstname} ${lieutenant.lastname} has been updated!`);
        return res.redirect('/admin/');
      })
      .catch( error => {

        console.error("LIEUTENANT UPDATED ERROR", error);
        req.flash("error", "Could not updated Lieutenant");
        return res.redirect('/admin/');
      });
  });

};
