'use strict';


module.exports = function(m) {
    m.controller('AdminSideBarController', function($scope, $rootScope, store, $location, authService, userService, utilService) {
        authService.adminAuthenticate();
        $scope.currentActiveParent = 'dashboard';
        $scope.currentActiveChild = '';
        $rootScope.$on('CHANGE_SIDEBAR_ITEM', function(event, parent, child) {
            console.log('parent child', parent, child);
            $scope.currentActiveParent = parent;
            $scope.currentActiveChild = child;
        });

        userService.getAllCountries(function(countries) {
            var COUNTRY_MAP = utilService.COUNTRY_MAP;
            var countryList = [];

            for (var i = 0; i < countries.length; i++) {
                var country = countries[i];
                for (var countryCode in COUNTRY_MAP) {
                    var countryName = COUNTRY_MAP[countryCode];
                    if ((countryName == country) || (countryName.toUpperCase() == country)) {
                        countryList.push({
                            name: countryName,
                            code: countryCode.toLowerCase()
                        })
                    }
                }
            };


            $scope.countryList = countryList;

        });
    });
};