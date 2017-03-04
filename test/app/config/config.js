'use strict';

const expect = require('chai').expect,
      config = require('../../../config/config');

describe('test configuration file', function() {

  it('should load correctly', function() {

    expect(process.env.NODE_ENV).to.eql('development');

    expect(config).to.eql({
      root: config.root,
      app: {
        name: 'olmc_feast_lieutenants'
      },
      port: process.env.PORT || 3000,
      db: 'mysql://localhost/test-development'
    });
  });

});
