"use strict";

const express = require('express'),
      router = express.Router();

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
};
