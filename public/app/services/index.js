'use strict';
var m = angular.module('ht.services', []);


// factories

require('./lib/user')(m);
require('./lib/auth')(m);
require('./lib/analytics')(m);

module.exports = m;