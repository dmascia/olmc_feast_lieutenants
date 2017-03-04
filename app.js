"use strict";

const express = require('express'),
      config = require('./config/config'),
      db = require('./app/models'),
      app = express();

module.exports = require('./config/express')(app, config);

db.sequelize
  .sync()
  .then( () => {

    if (!module.parent) {

      app.listen(config.port, function () {
        console.log('Express server listening on port ' + config.port);
      });
    }
  })
  .catch( error => {

    throw new Error(error);
  });

