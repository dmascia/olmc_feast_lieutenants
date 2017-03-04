"use strict";

const express = require('express'),
      router = express.Router(),
      db = require('./../models');

module.exports = (app, passport, ensureLogin, isAuthorized) => {

  app.use('/admin', router);

  router.get('/',
    ensureLogin.ensureLoggedIn('/'),
    isAuthorized('ADMIN'),
    (req, res) => {

    return res.render('admin');
  });

};
