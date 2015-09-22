'use strict';
var m = angular.module('ht.directives', []);


// directives
require('./lib/route-loader')(m);
require('./lib/users-country-visit')(m);
require('./lib/keyword-search')(m);
require('./lib/visitors-role-by-country')(m);
require('./lib/searched-project-per-category')(m);
require('./lib/page-views')(m);
require('./lib/completed-projects')(m);
require('./lib/content-pieces')(m);

module.exports = m;