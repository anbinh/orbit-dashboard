'use strict';
angular.module('app')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider

            .when('/', {
                templateUrl: 'admin/index.html',
                controller: 'AdminIndexController',
                resolve: {
                    Countries: ['userService', '$route',
                        function(userService, $route) {

                            return userService.getAllCountries({}).$promise.then(function(countries) {
                                return countries;
                            });
                        }
                    ]
                }
            }).when('/users', {
                templateUrl: 'admin/users.html',
                controller: 'AdminUsersController',
                resolve: {
                    Users: ['userService', '$route',
                        function(userService, $route) {
                            return userService.query({}).$promise.then(function(users) {
                                return users;
                            });
                        }
                    ]
                }
            }).when('/users/:id', {
                templateUrl: 'admin/user-detail.html',
                controller: 'AdminUserDetailController',
                resolve: {
                    Keywords: ['analyticsService', '$route',
                        function(analyticsService, $route) {
                            var id = $route.current.params.id;
                            return analyticsService.tenKeywordsByUser({
                                id: id,
                                days: -1
                            }).$promise.then(function(cards) {
                                return cards;
                            });
                        }
                    ]
                }
            }).when('/countries/:id', {
                templateUrl: 'admin/country-detail.html',
                controller: 'AdminCountryDetailController',
                resolve: {
                    SelectedCountry: ['$route',
                        function($route) {
                            return $route.current.params.id.toUpperCase();

                        }
                    ]
                }
            });
        }
    ]);