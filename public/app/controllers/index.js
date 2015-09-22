'use strict';
var m = angular.module('ht.controllers', []);


// controllers


require('./lib/admin/index')(m);
require('./lib/admin/head')(m);
require('./lib/admin/sidebar')(m);
require('./lib/admin/login')(m);
require('./lib/admin/users')(m);
require('./lib/admin/user-detail')(m);
require('./lib/admin/country-detail')(m);

module.exports = m;