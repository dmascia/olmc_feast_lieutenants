"use strict";

const path = require('path'),
      rootPath = path.normalize(__dirname + '/..'),
      env = process.env.NODE_ENV || 'development';

const config = {

  development: {
    root: rootPath,
    app: {
      name: 'olmc_feast_lieutenants'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/test-development'
  }
};

module.exports = config[env];
