"use strict";

const express = require('express'),
      router = express.Router(),
      nodemailer = require("nodemailer"),
      config = require("../../config/config"),
      sgTransport = require('nodemailer-sendgrid-transport'),
      db = require('./../models');

module.exports = (app, passport, ensureLogin) => {

  app.use('/', router);

  router.get('/', (req, res) => {

    const flashMessage = req.flash();

    return res.render('index', {
      csrfToken: req.csrfToken(),
      error: (flashMessage.error) ? flashMessage.error[0] : ""
    });
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: 'Invalid credentials or Your account may be locked out'
  }));

  router.get('/dashboard', ensureLogin.ensureLoggedIn('/'),
    (req, res) => {

      if (req.user.roles === "ADMIN") {

        return res.redirect("/admin");
      } else {

        return res.redirect("/lieutenant");
      }
    }
  );

  router.get('/logout',  ensureLogin.ensureLoggedIn('/'),
      (req, res) => {

      req.logout();
      return res.redirect('/');
    }
  );

  router.get('/', (req, res) => {

    const flashMessage = req.flash();

    return res.render('index', {
      csrfToken: req.csrfToken(),
      error: (flashMessage.error) ? flashMessage.error[0] : ""
    });
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: 'Invalid credentials or Your account may be locked out'
  }));

  router.get('/pay', (req, res) => {

    const flashMessage = req.flash();

    db.Users.findAll({
      where: { roles: "LIEUTENANT" },
      attributes: ['id', 'firstname', 'lastname'],
      limit: 8
    })
    .then( findResult => {

      if (findResult.length === 0) {

        throw new Error("no lieutenants found");
      }

      const data = findResult.map( user => {

        return {
          id: user.dataValues.id,
          name: `${user.dataValues.firstname} ${user.dataValues.lastname}`
        };
      });

      return res.render('pay', {
        data: data,
        paypal: config.paypal,
        csrfToken: req.csrfToken(),
        success: (flashMessage.success) ? flashMessage.success[0] : "",
        error: (flashMessage.error) ? flashMessage.error[0] : "",
      });
    })
    .catch( error => {

      console.error("PAY ERROR", error);

      return res.render('pay', {
        csrfToken: req.csrfToken(),
        error: "no lieutenants found!",
      });
    });
  });

  router.post('/execute-payment', (req, res) => {

    const payment = JSON.parse(req.body.payment);
    delete payment.returnUrl;

    let lieutenantEmail;

    db.Users.find({
      where: { id: payment.UserId },
      attributes: ['email']
    })
    .then( findResult => {

      if (findResult.length === 0) {

        throw new Error("no lieutenant found");
      }

      lieutenantEmail = findResult.dataValues.email;

      return db.Payments.create(payment);
    })
    .then( paymentResult => {

      if (!paymentResult) {

        req.flash("error", "Sorry an error occured, contact your lieutenant");
        return res.redirect('/pay/');
      }

      const transporter = nodemailer.createTransport(sgTransport({
        auth: {
          api_key: config.transporter.key
        }
      }));

      let mailOptions = {
        from: '"OLMC Feast Lieutenant" <olmcfeast@gmail.com>',
        to: lieutenantEmail,
        bcc: "olmcfeast@gmail.com",
        subject: 'Lifter Dues Paid',
        text: `${payment.firstname} ${payment.lastname} has paid his lifter dues. Paypal Transaction ID: ${payment.paymentID}`,
        html: `${payment.firstname} ${payment.lastname} has paid his lifter dues. Paypal Transaction ID: ${payment.paymentID}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message', info);
      });
    })
    .catch( error => {

      console.error("PAYMENT CREATION ERROR", error);
      req.flash("error", "Sorry an error occured, contact your lieutenant");
      return res.redirect('/pay/');
    });

    return res.json("OK");
  });

};
