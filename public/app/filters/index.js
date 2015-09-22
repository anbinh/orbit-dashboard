'use strict';
var m = angular.module('ht.filters', []);


// controllers
require('./lib/title-case')(m);
require('./lib/discount')(m);
require('./lib/value')(m);


module.exports = m;