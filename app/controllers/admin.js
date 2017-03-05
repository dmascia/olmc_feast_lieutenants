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

      db.Users.findAndCountAll({
        where: { roles: "LIEUTENANT"},
        limit: 8
      })
      .then( findAndCountResult => {

        const count = findAndCountResult.count;
        let data = [];

        if (count > 0) {

          data = findAndCountResult.rows.map( user => {

            return {
              id: user.dataValues.id,
              username: user.dataValues.username,
              firstname: user.dataValues.firstname,
              lastname: user.dataValues.lastname,
              email: user.dataValues.email,
              totals: {
                lifters: 0
              }
            };
          });
        }

        const flashMessage = req.flash();

        return res.render('admin', {
          count: count,
          data: data,
          csrfToken: req.csrfToken(),
          success: (flashMessage.success) ? flashMessage.success[0] : "",
          error: (flashMessage.error) ? flashMessage.error[0] : "",
        });
      });
  });

};
