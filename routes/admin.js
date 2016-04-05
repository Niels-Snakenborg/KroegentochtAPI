var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');

/* GET admin page. */
router.get('/', auth('admin'), function(req, res, next) {
    res.render('admin', { title: 'Kroegentocht Admin Panel', user: req.user });
});

router.get('/race_crud', auth('admin'), function(req, res, next) {
    res.render('race_crud', { title: 'Kroegentocht Race Crud', user: req.user });
});

router.get('/user_crud', auth('admin'), function(req, res, next) {
    res.render('user_crud', { title: 'Kroegentocht User Crud', user: req.user });
});
module.exports = router;
