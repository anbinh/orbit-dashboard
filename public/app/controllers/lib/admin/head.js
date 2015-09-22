'use strict';


module.exports = function(m) {
    m.controller('AdminHeadController', function($scope, $rootScope, store, $location, authService, userService) {

        $scope.logout = function() {

            store.remove('admin');
            window.location = '/admin-login/#/';
        };
    });
};