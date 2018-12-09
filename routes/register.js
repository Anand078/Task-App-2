var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

var User = require('../model/userDetails');

const isUserNameExists = function(userName, callback){
    User.findOne({
        userName: userName
    }, function(err, doc) {
        if(err) return callback(err, null);
        return callback(null, doc!==null);
    });
}

router.post('/', function (req, res) {
    var user = new User({
        fullName: req.body.fullName,
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
    });
    isUserNameExists(req.body.userName, function(errStatus, isExists){
        if(errStatus===null){
            if(isExists){
                return res.status(422).json({
                    message: "this username already existed."
                });
            }
            user.save(function(err, result) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                res.status(201).json({
                    message: 'User has been created successfully',
                    obj: result
                });
            });
        }
        else{
            res.status(500).json({
                message: err.message || err.stack
            });
        }
    });
});

module.exports = router;