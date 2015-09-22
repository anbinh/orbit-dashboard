'use strict';


module.exports = function(m) {
    m.controller('AdminLoginController', function($scope, $rootScope, store, $location, authService, userService) {

        $scope.login = function() {
            userService.adminLogin($scope.user, function(ret) {


                store.set('admin', ret);


                window.location = '/#/';

            }, function(err) {
                swal('Error', err.data.message, 'error');
                $scope.user.username = '';
                $scope.user.password = '';
            });
        };
    });
};