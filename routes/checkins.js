var express = require('express');
var router = express.Router();
var Checkin = require('mongoose').model('Checkin');
var auth = require('../modules/auth');

router.route('/')
    .get(function(req, res) {
        Checkin.find().exec(function(err, checkins){
            if(err){ return next(err); }
            res.json(checkins);
        });
    });

router.route('/waypoint/:waypoint')
    .get(function(req, res) {
        Checkin.find({'waypoint':req.params.waypoint}, function (err, checkins) {
            if(err){ return next(err); }
            res.json(checkins);
        });
    });

router.route('/add')
    .post(function(req, res) {
        var io = req.app.get('io');
        var date = new Date();
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var newCheckin = new Checkin();
        newCheckin.username = req.body.username;
        newCheckin.userid = req.body.userid;
        newCheckin.waypoint = req.body.waypoint;
        newCheckin.date = (hours + ':' + minutes.substr(-2)).toString();

        newCheckin.save(function(err){

            if (err) {
                console.log(err);
                res.status(500);
                res.json({
                    status: 500,
                    error: err
                });
                res.end();
            }
            else {
                res.json({
                    status: 200,
                    newCheckin: newCheckin
                });
                io.emit('CheckinUpdate', {id: req.body.waypoint});
                res.end();
            }
        });

    });


module.exports = router;

