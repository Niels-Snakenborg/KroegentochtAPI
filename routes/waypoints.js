var express = require('express');
var router = express.Router();
var Waypoint = require('mongoose').model('Waypoint');
var auth = require('../modules/auth');

var result;

router.route('/')
    .get(function(req, res) {
        Waypoint.find().exec(function(err, waypoints){
            if(err){ return next(err); }
            res.json(waypoints);
        });
    });

router.route('/search')
    .get(function(req, res) {
        var lat = req.query.lat;
        var long = req.query.long;
        var radius = req.query.radius;
        var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyA9gEeVLWrgbsZzYXKNnQcMaQgPHEUNUX4&location=' + lat + ',' + long + '&radius=' + radius + '&type=cafe';

        var request = require('request');
        request({
            url: url,
            json: true,
            headers: {
                'Content-Type': 'application/json',
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(body);
            }
        })
    });

// Get all by races
router.route('/race/:id')
    .get(function(req, res) {
        Waypoint.find({'race':req.params.id}, function (err, waypoints) {
            if(err){ return next(err); }
            res.json(waypoints);
        });
    });

router.route('/place/:placeid')
    .get(function(req, res) {
        var url = 'https://maps.googleapis.com/maps/api/place/details/json?key= AIzaSyA9gEeVLWrgbsZzYXKNnQcMaQgPHEUNUX4&placeid=' + req.params.placeid;

        var request = require('request');
        request({
            url: url,
            json: true,
            headers: {
                'Content-Type': 'application/json',
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                result = body.result;
                res.json(result);
            }
        })
    });

router.route('/add/:placeid')
    .post(auth('admin'), function(req, res) {
        var url = 'https://maps.googleapis.com/maps/api/place/details/json?key= AIzaSyA9gEeVLWrgbsZzYXKNnQcMaQgPHEUNUX4&placeid=' + req.params.placeid;

        var request = require('request');
        request({
            url: url,
            json: true,
            headers: {
                'Content-Type': 'application/json',
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                result = body.result;

                var newWaypoint = new Waypoint();
                newWaypoint.name = result.name;
                newWaypoint.lat = result.geometry.location.lat;
                newWaypoint.long = result.geometry.location.lng;
                newWaypoint.place_id = result.place_id;
                newWaypoint.adress = result.formatted_address;
                newWaypoint.website = result.website;
                newWaypoint.race = req.body.race;

                newWaypoint.save(function(err){

                    if (err) {
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
                            newWaypoint: newWaypoint
                        });
                        res.end();
                    }
                });
            }
        })

});

router.delete('/:id/delete',auth('admin'), function(req, res, next) {
    Waypoint.findById(req.params.id, function (err, waypoints) {
        if(err) { return next(err); }
        if(!waypoints) { return res.sendStatus(404); }
        waypoints.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.sendStatus(204);
        });
    });
});

module.exports = router;

