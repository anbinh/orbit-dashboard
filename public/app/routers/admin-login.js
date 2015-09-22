'use strict';
angular.module('app')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider

            .when('/', {
                templateUrl: 'admin/login.html',
                controller: 'AdminLoginController',
                resolve: {}
            });
        }
    ]);