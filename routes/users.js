var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var auth = require('../modules/auth');

router.route('/')
    .get(function(req, res) {
      User.find().select("-password").exec(function(err, users){
        if(err){ return next(err); }
        res.json(users);
      });
    });

router.route('/add')
    .post(auth('admin'), function(req, res) {
        var newUser = new User();
        newUser.username = req.body.username;
        newUser.password = newUser.generateHash(req.body.password);
        newUser.role = req.body.role;

        newUser.save(function(err){

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
                    newUser: newUser
                });
                res.end();
            }
        });

    });

router.delete('/:id/delete',auth('admin'), function(req, res, next) {
    User.findById(req.params.id, function (err, users) {
        if(err) { return next(err); }
        if(!users) { return res.send(404); }
        users.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.send(204);
        });
    });
});

router.put('/:id/update',auth('admin'), function(req, res, next) {
    var user = new User();
    User.update({
        "_id": req.params.id
    }, {
        "password": user.generateHash(req.body.password),
        "role": req.body.role
    }, function(err, model) {
        if (err)
            return res.send(204);
    });
});


module.exports = router;

