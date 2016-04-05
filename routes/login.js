var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Kroegentocht API', message: req.flash('loginMessage') });
});

module.exports = router;
