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
    db: 'mysql://root:root@localhost:8889/olmcfeast',
    paypal: {
      env: "sandbox",
      clientId: "AWpcWnSknfcPAnkpel5M8kqGJp5gCJQbGH-CkOYF5Qy78FBTfNQhb8CN9z95U4wqHKur-o0QrBQB7P3B"
    },
    transporter: {
      key: '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'
    }
  }
};

module.exports = config[env];
