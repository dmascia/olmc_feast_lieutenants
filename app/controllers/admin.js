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

      let lieutenantCount,
          lieutenantData;

      db.Users.findAndCountAll({
        where: { roles: "LIEUTENANT" },
        attributes: ['id', 'username', 'email', 'firstname', 'lastname'],
        limit: 8
      })
      .then( findAndCountResult => {

        const lieutenantCount = findAndCountResult.count;

        if (lieutenantCount < 1) {

          throw new Error("no lieutenants");
        }

        lieutenantData = findAndCountResult.rows;

        return db.Lifters.findAll();
      })
      .then( liftersResult => {

        if (liftersResult.length < 1) {

          throw new Error("no lifters found");
        }

        const data = lieutenantData.map( user => {

          let lifterCount = 0;

          liftersResult.forEach( lifter => {

            if (lifter.dataValues.UserId === user.dataValues.id) {

              lifterCount++;
            }
          });

          return {
            id: user.dataValues.id,
            username: user.dataValues.username,
            firstname: user.dataValues.firstname,
            lastname: user.dataValues.lastname,
            email: user.dataValues.email,
            totals: {
              lifters: lifterCount
            }
          };
        }, []);

        return res.render('admin', {
          lieutenantCount: lieutenantCount,
          lieutenants: data,
          csrfToken: req.csrfToken(),
          success: (flashMessage.success) ? flashMessage.success[0] : "",
          error: (flashMessage.error) ? flashMessage.error[0] : ""
        });
      })
      .catch( error => {

        console.error("FIND LIEUTENANTS ERROR", error);

        return res.render('admin', {
          count: 0,
          csrfToken: req.csrfToken(),
          success: (flashMessage.success) ? flashMessage.success[0] : "",
          error: "no lieutenants found!"
        });
      });
  });

};
