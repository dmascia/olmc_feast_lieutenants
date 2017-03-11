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

  router.post('/:lifter/delete',
    ensureLogin.ensureLoggedIn('/'),
    isAuthorized('ADMIN'),
    (req, res) => {

      db.Lifters.destroy({ where: { id: req.params.lifter } })
        .then( deleteResult => {

          if (!deleteResult) {

            req.flash("error", "Could not delete lifter");
            return res.redirect('/admin/');
          }

          req.flash("success", `Lifter has been created!`);
          return res.redirect('/admin/');
        })
        .catch( error => {

          console.error("LIFTER DELETE ERROR", error);
          req.flash("error", "Could not delete lifter");
          return res.redirect('/admin/');
        });
  });

  router.post('/:lifter/update',
    ensureLogin.ensureLoggedIn('/'),
    isAuthorized('LIEUTENANT'),
    (req, res) => {

      const lifter = req.body;
      const lifterId = req.params.lifter;

      db.Lifters.update( lifter,
        { where: { id: lifterId } }
      )
      .then( updateResult => {

        if (!updateResult) {

          req.flash("error", "Could not update lifter");
          return res.redirect('/lieutenant/');
        }

        req.flash("success", `Lifter ${lifter.firstname} ${lifter.lastname} has been updated!`);
        return res.redirect('/lieutenant/');
      })
      .catch( error => {

        console.error("LIFTER UPDATED ERROR", error);
        req.flash("error", "Could not updated lifter");
        return res.redirect('/lieutenant/');
      });
  });

  router.post('/:lifter/paid',
    ensureLogin.ensureLoggedIn('/'),
    isAuthorized('LIEUTENANT'),
    (req, res) => {

      const lifter = req.body;
      const lifterId = req.params.lifter;

      db.Payments.create(lifter)
        .then( createPaymentResult => {

          if (!createPaymentResult) {

            req.flash("error", "Could not mark lifter as paid");
            return res.redirect('/lieutenant/');
          }

          req.flash("success", `Lifter ${lifter.firstname} ${lifter.lastname} has paid his dues!`);
          return res.redirect('/lieutenant/');
        })
        .catch( error => {

          console.error("CREATE LIFTER PAYMENT ERROR", error);
          req.flash("error", "Could not mark lifter as paid");
          return res.redirect('/lieutenant/');
        });
    });

};
