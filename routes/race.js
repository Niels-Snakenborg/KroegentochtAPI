var express = require('express');
var router = express.Router();

/* GET profile page. */
router.get('/', function(req, res, next) {

    var request = require('request');
    request({
        url: "http://localhost:3000/api/races/" + req.query.raceid,
        json: true,
        headers: {
            'Content-Type': 'application/json',
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.render('race', { title: 'Kroegentocht dashboard', user: req.user, race: body });
        }

    });
});

module.exports = router;
