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

      const flashMessage = req.flash();

      db.Users.findAndCountAll({
        where: { roles: "LIEUTENANT" },
        attributes: ['id', 'username', 'email', 'firstname', 'lastname'],
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

        return res.render('admin', {
          count: count,
          data: data,
          csrfToken: req.csrfToken(),
          success: (flashMessage.success) ? flashMessage.success[0] : "",
          error: (flashMessage.error) ? flashMessage.error[0] : "",
        });
      })
      .catch( error => {

        console.error("FIND LIEUTENANTS ERROR", error);

        return res.render('admin', {
          count: 0,
          csrfToken: req.csrfToken(),
          success: (flashMessage.success) ? flashMessage.success[0] : "",
          error: "no lieutenants found!",
        });
      });
  });

};
