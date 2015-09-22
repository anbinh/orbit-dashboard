'use strict';


module.exports = function(m) {
    m.factory('userService', ['$resource',
        function($resource) {

            return $resource('/api/users/:id', null, {

                'adminLogin': {
                    method: 'POST',
                    'url': '/api/users/admin-login',
                },
                'getAllCountries': {
                    method: 'GET',
                    'url': '/api/users/countries',
                    isArray: true
                }

            });
        }
    ]);
};