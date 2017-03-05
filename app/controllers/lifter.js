"use strict";

const express = require('express'),
      router = express.Router(),
      db = require('./../models');

module.exports = (app, passport, ensureLogin, isAuthorized) => {

  app.use('/lifter', router);

  router.post('/',
    ensureLogin.ensureLoggedIn('/'),
    isAuthorized('LIEUTENANT'),
    (req, res) => {

      let lifter = req.body;
      lifter.UserId = req.user.id;

      db.Lifters.create(lifter)
        .then( createLifterResult => {

          if (!createLifterResult) {

            req.flash("error", "Could not save lifter");
            return res.redirect('/lieutenant/');
          }

          req.flash("success", `Lifter ${lifter.firstname} ${lifter.lastname} has been created!`);
          return res.redirect('/lieutenant/');
        })
        .catch( error => {

          console.error("LIFTER CREATION ERROR", error);
          req.flash("error", "Could not save lifter");
          return res.redirect('/lieutenant/');
        });
  });

};
