const express = require('express'),
      router = express.Router();

module.exports = app => {

  app.use('/', router)
};

router.get('/', (req, res) => {

 return res.render('index');
});
