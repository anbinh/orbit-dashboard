'use strict';

require('./services');
require('./filters');
require('./directives');
require('./controllers');

// app.js
angular.module('app', [
    'ht.services',
    'ht.directives',
    'ht.filters',
    'ht.controllers',
    'ht.templates',
    'ngRoute',
    'ngResource',
    'angular-storage',
    'oitozero.ngSweetAlert',
    'ui.bootstrap',
    'nouislider'
]);