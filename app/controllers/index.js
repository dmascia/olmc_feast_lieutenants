"use strict";

const express = require('express'),
      router = express.Router();

module.exports = (app, passport, ensureLogin) => {

  app.use('/', router);

  router.get('/', (req, res) => {

    return res.render('index', {
      csrfToken: req.csrfToken(),
    });
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: 'Invalid credentials'
  }));

  router.get('/dashboard', ensureLogin.ensureLoggedIn('/'),
    (req, res) => {

      if (req.user.roles === "ADMIN") {

        return res.redirect("/admin");
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
