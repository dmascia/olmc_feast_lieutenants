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
        where: { roles: "LIEUTENANT"}
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
                lifters: 0,
                out: 0,
                in: 0
              }
            };
          });
        }

        return res.render('admin', {
          count: count,
          data: data
        });
      });
  });

};
