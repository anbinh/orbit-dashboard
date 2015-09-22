'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/', function(req, res) {
    res.render('dashboard', {

    });
});

router.get('/admin-login', function(req, res) {
    res.render('admin_login', {

    });
});


module.exports = router;