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
              name: `${user.dataValues.firstname} ${user.dataValues.lastname}`,
              username: user.dataValues.username,
              email: user.dataValues.email
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
