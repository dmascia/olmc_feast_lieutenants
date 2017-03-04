'use strict';

const expect = require('chai').expect,
      express = require('express'),
      configure = require('../../../config/express');

describe('test configuration of express', function() {

  it('should load configuration', function() {

    expect(configure).to.be.a('function');
  });

  it('should return application object', function() {

    const application = express();

    expect(configure(application, {})).to.eql(application);
  });
});
