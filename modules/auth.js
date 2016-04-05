module.exports = function(role){

    return function(req, res, next){
        if(!req.user)
            res.sendStatus(401);
        else if(!role || req.user.isInRole(role))
            next();
        else{
            res.sendStatus(403);
        }
    }
}

