'use strict';


module.exports = function(m) {
    m.controller('AdminUsersController', function($scope, $rootScope, store, $location, authService, Users, $timeout) {

        authService.adminAuthenticate();

        $rootScope.$broadcast('CHANGE_SIDEBAR_ITEM', 'users', '');

        $scope.users = Users;

        $timeout(function() {
            $('#datatable-default').dataTable();
        });


        $scope.goToUserDetail = function(id) {
            window.location = '/#/users/' + id;
        };

    });
};