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
          lieutenantData,
          liftersData;

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

        liftersData = liftersResult;

        let likeThisYear = "" + new Date().getFullYear() + "%";

        return db.sequelize.query("SELECT firstname, lastname FROM Payments WHERE UserId = 8 AND createdAt LIKE '" + likeThisYear + "' ORDER BY lastname ASC;");
      })
      .then( paymentsResult => {

        let data = [],
            grandTotal = 0,
            grandTotalIn = 0,
            lifterMarkedDelete = [];

        if (paymentsResult[0].length > 1) {
          data = lieutenantData.map( user => {

            let lifterCount = 0,
                lifterInCount = 0;

            liftersData.forEach( lifter => {

              if (lifter.dataValues.UserId === user.dataValues.id) {

                lifterCount++;

                if (lifter.dataValues.isRemoved === 1) {

                  lifterMarkedDelete.push({
                    ltname: `${user.dataValues.firstname} ${user.dataValues.lastname}`,
                    lifterId: lifter.dataValues.id,
                    firstname: lifter.dataValues.firstname,
                    lastname: lifter.dataValues.lastname,
                    email: lifter.dataValues.email,
                    address: lifter.dataValues.address,
                    city: lifter.dataValues.city,
                    state: lifter.dataValues.state,
                    zip: lifter.dataValues.zip,
                    phone: lifter.dataValues.phone
                  });
                }
              }

              paymentsResult[0].forEach( payment => {

                if (
                  payment.firstname.toLowerCase() === lifter.dataValues.firstname.toLowerCase() &&
                  payment.lastname.toLowerCase() === lifter.dataValues.lastname.toLowerCase()
                ) {

                  lifterInCount++;
                }
              });
            });

            grandTotalIn = (grandTotalIn + (lifterInCount * 100.00));
            grandTotal = (grandTotal + (lifterCount * 100.00));

            return {
              id: user.dataValues.id,
              username: user.dataValues.username,
              firstname: user.dataValues.firstname,
              lastname: user.dataValues.lastname,
              email: user.dataValues.email,
              totals: {
                lifters: lifterCount,
                in: lifterInCount,
                out: (lifterCount - lifterInCount),
                amountIn: (lifterInCount * 100.00).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
                amountExpected: (lifterCount * 100.00).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
              }
            };
          });
        } else {

          data = lieutenantData.map( user => {

            let lifterCount = 0;

            liftersData.forEach( lifter => {

              if (lifter.dataValues.UserId === user.dataValues.id) {

                lifterCount++;

                if (lifter.dataValues.isRemoved === 1) {

                  lifterMarkedDelete.push({
                    ltname: `${user.dataValues.firstname} ${user.dataValues.lastname}`,
                    lifterId: lifter.dataValues.id,
                    firstname: lifter.dataValues.firstname,
                    lastname: lifter.dataValues.lastname,
                    email: lifter.dataValues.email,
                    address: lifter.dataValues.address,
                    city: lifter.dataValues.city,
                    state: lifter.dataValues.state,
                    zip: lifter.dataValues.zip,
                    phone: lifter.dataValues.phone
                  });
                }
              }
            });

            grandTotal = (grandTotal + (lifterCount * 100.00));

            return {
              id: user.dataValues.id,
              username: user.dataValues.username,
              firstname: user.dataValues.firstname,
              lastname: user.dataValues.lastname,
              email: user.dataValues.email,
              totals: {
                lifters: lifterCount,
                in: 0,
                out: lifterCount,
                amountIn: 0,
                amountExpected: (lifterCount * 100.00).toFixed(2)
              }
            };
          });
        }

        lifterMarkedDelete.sort();

        return res.render('admin', {
          lieutenantCount: lieutenantCount,
          lieutenants: data,
          lifterMarkedDelete: lifterMarkedDelete,
          grandTotalIn: grandTotalIn.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
          grandTotal: grandTotal.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
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
