"use strict";

const express = require('express'),
      glob = require('glob'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      compress = require('compression'),
      methodOverride = require('method-override'),
      nunjucks = require('nunjucks'),
      session = require('express-session'),
      passport = require('./../app/middleware/passport'),
      isAuthorized = require('./../app/middleware/isAuthorized'),
      csrf = require('csurf'),
      flash = require('connect-flash'),
      ensureLogin = require('connect-ensure-login'),
      SequelizeStore = require('connect-session-sequelize')(session.Store),
      db = require('./../app/models/index'),
      json2csv = require('express-json2csv'),
      cookieSession = require('cookie-session');

module.exports = (app, config) => {

  const env = process.env.NODE_ENV || 'development';

  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  app.set('views', `${config.root}/app/views`);
  app.set('view engine', 'nunjucks');

  nunjucks.configure(`${config.root}/app/views`, {
      autoescape: true, express: app
  });

 // app.use(favicon(`${config.root}/public/img/favicon.ico`));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({  extended: true }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(`${config.root}/public`));
  app.use(methodOverride());
  app.use(cookieSession({
    name: 'olmc',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000
  }));
  app.use(session({
    secret: 'zriRHn1GY1pAREBIZHFS',
    cookie: { httpOnly: true, secure: true },
    saveUninitialized: false,
    resave: false,
    store: new SequelizeStore({
      db: db.sequelize
    })
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(csrf());
  app.use(json2csv);

  const controllers = glob.sync(`${config.root}//app/controllers/*.js`);

  controllers.forEach( controller => {

    require(controller)(app, passport, ensureLogin, isAuthorized);
  });

  app.use( (req, res, next) => {

    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){

    app.use( (err, req, res) => {

      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use( (err, req, res ) => {

    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

  return app;
};
