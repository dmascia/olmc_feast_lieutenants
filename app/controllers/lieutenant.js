"use strict";

const express = require('express'),
      router = express.Router(),
      db = require('./../models'),
      crypto = require('crypto');

module.exports = (app, passport, ensureLogin, isAuthorized) => {

  app.use('/lieutenant', router);

  router.get('/',
    ensureLogin.ensureLoggedIn('/'),
    isAuthorized('LIEUTENANT'),
    (req, res) => {

      const flashMessage = req.flash();

      let lifterResult = [],
          lifterCount = 0;

      db.Lifters.findAndCountAll({
        where: { UserId: req.user.id },
        order: 'lastname ASC'
      })
      .then( liftersResult => {

        if (liftersResult.count === 0) {

          throw new Error("no lifters found!");
        }

        lifterCount = liftersResult.count;
        lifterResult = liftersResult.rows;

        let likeThisYear = "" + new Date().getFullYear() + "%";

        return db.sequelize.query("SELECT firstname, lastname FROM Payments WHERE UserId = 8 AND createdAt LIKE '" + likeThisYear + "';");
      })
      .then( paymentsResult => {

        let liftersData = [],
            lifterInCount = 0;

        if (paymentsResult[0].length > 1) {

          liftersData = lifterResult.map( lifter => {

            let newLifter = {
              id: lifter.dataValues.id,
              firstname: lifter.dataValues.firstname,
              lastname: lifter.dataValues.lastname,
              email: lifter.dataValues.email,
              address: lifter.dataValues.address,
              city: lifter.dataValues.city,
              state: lifter.dataValues.state,
              zip: lifter.dataValues.zip,
              tshirt_size: lifter.dataValues.tshirt_size,
              phone: lifter.dataValues.phone,
              dob: lifter.dataValues.dob,
              UserId: lifter.dataValues.UserId,
              status: "OUT"
            };

            paymentsResult[0].forEach( payment => {

              if (
                payment.firstname === lifter.dataValues.firstname &&
                payment.lastname === lifter.dataValues.lastname
              ) {

                lifterInCount++;

                newLifter.status = "IN";
              }
            });

            return newLifter;
          });
        } else {

          liftersData = lifterResult.map( lifter => {

            return {
              id: lifter.dataValues.id,
              firstname: lifter.dataValues.firstname,
              lastname: lifter.dataValues.lastname,
              email: lifter.dataValues.email,
              address: lifter.dataValues.address,
              city: lifter.dataValues.city,
              state: lifter.dataValues.state,
              zip: lifter.dataValues.zip,
              tshirt_size: lifter.dataValues.tshirt_size,
              phone: lifter.dataValues.phone,
              dob: lifter.dataValues.dob,
              UserId: lifter.dataValues.UserId,
              status: "OUT"
            };
          });
        }

        return res.render('lieutenant', {
          lieutenant: `${req.user.firstname} ${req.user.lastname}`,
          lifterCount: lifterCount,
          liftersOutCount: (lifterCount - lifterInCount),
          lifterInCount: lifterInCount,
          lifters: liftersData,
          csrfToken: req.csrfToken(),
          success: (flashMessage.success) ? flashMessage.success[0] : "",
          error: (flashMessage.error) ? flashMessage.error[0] : ""
        });
      })
      .catch( error => {

        console.error("FIND LIFTERS ERROR", error);

        return res.render('lieutenant', {
          lieutenant: `${req.user.firstname} ${req.user.lastname}`,
          lifterCount: 0,
          error: "no lifters found!"
        });
      });
  });

  router.post('/',
    ensureLogin.ensureLoggedIn('/'),
    isAuthorized('ADMIN'),
    (req, res) => {

      if (req.body.password !== req.body.verifyPassword) {

        req.flash("error", "Password do not match!");
        return res.status(400).send("passwords do not match");
      }

      const salt = crypto.randomBytes(20).toString('hex');
      const hashedPassword = crypto.createHash('md5')
        .update(`${salt}${req.body.password}`)
        .digest('base64');

      const lieutenant = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        username_canonical: req.body.username,
        email: req.body.email,
        email_canonical: req.body.email,
        enabled: true,
        salt: salt,
        password: hashedPassword,
        locked: false,
        roles: "LIEUTENANT"
      };

      db.Users.create(lieutenant)
        .then( createUserResult => {

          if (!createUserResult) {

            req.flash("error", "Could not save lieutenant");
            return res.redirect('/admin/');
          }

          req.flash("success", `Lieutenant ${lieutenant.firstname} ${lieutenant.lastname} has been created!`);
          return res.redirect('/admin/');
        })
        .catch( error => {

          console.error("LIEUTENANT CREATION ERROR", error);
          req.flash("error", "Could not save lieutenant");
          return res.redirect('/admin/');
        });
  });

  router.post('/:lieutenantId/update',
    ensureLogin.ensureLoggedIn('/'),
    isAuthorized('ADMIN'),
    (req, res) => {

      const lieutenant = req.body;
      const lieutenantId = req.params.lieutenantId;

      db.Users.update( lieutenant,
        { where: { id: lieutenantId } }
      )
      .then( updateResult => {

        if (!updateResult) {

          req.flash("error", "Could not update Lieutenant");
          return res.redirect('/admin/');
        }

        req.flash("success", `Lieutenant ${lieutenant.firstname} ${lieutenant.lastname} has been updated!`);
        return res.redirect('/admin/');
      })
      .catch( error => {

        console.error("LIEUTENANT UPDATED ERROR", error);
        req.flash("error", "Could not updated lieutenant");
        return res.redirect('/admin/');
      });
  });

  router.post('/:lieutenantId/changePassword',
    ensureLogin.ensureLoggedIn('/'),
    isAuthorized('ADMIN'),
    (req, res) => {

      const lieutenantId = req.params.lieutenantId;

      if (req.body.password !== req.body.verifyPassword) {

        req.flash("error", "Password do not match!");
        return res.status(400).send("passwords do not match");
      }

      const salt = crypto.randomBytes(20).toString('hex');
      const hashedPassword = crypto.createHash('md5')
        .update(`${salt}${req.body.password}`)
        .digest('base64');


      db.Users.update(
        { password: hashedPassword, salt: salt},
        { where: { id: lieutenantId } }
      )
      .then( updateResult => {

        if (!updateResult) {

          req.flash("error", "Could not change lieutenants password");
          return res.redirect('/admin/');
        }

        req.flash("success", `Lieutenant password changed!`);
        return res.redirect('/admin/');
      })
      .catch( error => {

        console.error("LIEUTENANT CHANGE PASSWORD ERROR", error);
        req.flash("error", "Could not change lieutenant password");
        return res.redirect('/admin/');
      });
  });

};
