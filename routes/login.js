var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../model/userDetails');

router.post('/', function(req, res, next) {
    try {
        User.findOne({userName: req.body.userName}, function(err, user) {
            console.log(err);
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if (!user) {
                return res.status(401).json({
                    title: 'Login failed',
                    error: {message: 'Invalid login credentials'}
                });
            }
            try {
                if (!bcrypt.compareSync(req.body.password, user.password)) {
                    return res.status(401).json({
                        title: 'Login failed',
                        error: {message: 'Invalid login credentials'}
                    });
                }    
                res.status(200).json({
                    message: 'Successfully logged in',
                    userName: user.userName
                });
        
            } catch (error) {
                console.log(error);
                return res.json({
                    "error":error.message || error.stack
                })
            }
            
        });    
    } catch (error) {
        return res.json({
            "error":error.message || error.stack
        })
    }
    
});

module.exports = router;