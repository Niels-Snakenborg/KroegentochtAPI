var express = require('express');
var router = express.Router();
var Race = require('mongoose').model('Race');
var auth = require('../modules/auth');

// Get All
router.route('/')
    .get(function(req, res) {
        Race.find().exec(function(err, races){
            if(err){ return next(err); }
            res.json(races);
        });
    });

// Get One By id
router.route('/:id')
    .get(function(req, res) {
        Race.findOne({'_id':req.params.id}, function (err, races) {
            if(err){ return next(err); }
            res.json(races);
        });
    });

// Get One By user
router.route('/user/:id')
    .get(function(req, res) {
        Race.findOne({'creator':req.params.id}, function (err, races) {
            if(err){ return next(err); }
            res.json(races);
        });
    });

// Add New
router.route('/add')
    .post(auth('admin'), function(req, res) {
        var newRace = new Race();
        newRace.name = req.body.name;
        newRace.description = req.body.description;
        newRace.start_date = req.body.start_date;
        newRace.current_cafe = '';
        newRace.status = req.body.status;
        newRace.creator = req.body.creator;

        newRace.save(function(err){

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
                    newRace: newRace
                });
                res.end();
            }
        });

    });

router.delete('/:id/delete',auth('admin'), function(req, res, next) {
    Race.findById(req.params.id, function (err, races) {
        if(err) { return next(err); }
        if(!races) { return res.send(404); }
        races.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.send(204);
        });
    });
});

// Get currentCafe bij id
router.route('/:id/currentcafe')
    .get(function(req, res) {
        Race.findOne({'_id':req.params.id}, function (err, races) {
            if(err){ return next(err); }
            res.json(races.current_cafe);
        });
    });

// Put currentCafe bij id
router.put('/:id/set_currentcafe/',auth('admin'), function(req, res, next) {
    var io = req.app.get('io');
    Race.update({
        "_id": req.params.id
    }, {
        "current_cafe": req.body.current_cafe
    }, function(err, model) {
        io.emit('RaceUpdate', {id: req.params.id});
        if (err)
            return res.send(204);
    });
});

// Put status bij id
router.put('/:id/status',auth('admin'), function(req, res, next) {
    var io = req.app.get('io');
    Race.update({
        "_id": req.params.id
    }, {
        "status": req.body.status
    }, function(err, model) {
        io.emit('RaceUpdate', {id: req.params.id});
        if (err)
            return res.send(204);
    });
});

router.put('/:id/update',auth('admin'), function(req, res, next) {
    var io = req.app.get('io');
    Race.update({
        "_id": req.params.id
    }, {
        "name": req.body.name,
        "description": req.body.description,
        "start_date": req.body.start_date
    }, function(err, model) {
        io.emit('RaceUpdate', {id: req.params.id});
        if (err)
            return res.send(204);
    });
});

module.exports = router;

