'use strict';

var express = require('express');
var router = express.Router();
var Users = require('./usersSchema');


router.post('/admin-login', function(req, res, next) {
    var dat = req.body;

    if (dat.username === 'admin' && dat.password === '123456') {
        res.json({
            ok: true
        });
    } else {
        res.statusCode = 400;
        res.json({
            message: 'Wrong admin'
        });
        return;
    }

});

router.get('/', function(req, res, next) {

    Users.find({}, function(err, ret) {
        if (err) return next(err);

        res.json(ret);
    })
});

router.get('/countries', function(req, res, next) {

    Users.aggregate([{
        $group: {
            _id: {
                "country": "$country"
            },
            count: {
                $sum: 1
            }
        }
    }, {
        $sort: {
            count: -1
        }
    }], function(err, ret) {
        if (err) return next(err);

        var dat = [];
        for (var i = 0; i < ret.length; i++) {

            dat.push(ret[i]._id.country);

        };

        res.json(dat);
    });
});


module.exports = router;