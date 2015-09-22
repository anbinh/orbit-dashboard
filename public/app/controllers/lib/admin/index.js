'use strict';


module.exports = function(m) {
    m.controller('AdminIndexController', function($scope, $rootScope, store, $location, authService, Countries, $timeout, analyticsService, utilService) {

        authService.adminAuthenticate();

        $rootScope.$broadcast('CHANGE_SIDEBAR_ITEM', 'dashboard', '');


        $scope.selectedCountry = 'UNITED STATES';

        console.log('countries', Countries);

        var COUNTRY_MAP = utilService.COUNTRY_MAP;

        var transformCountries = function() {
            var dat = {};

            for (var i = 0; i < Countries.length; i++) {
                var country = Countries[i];
                for (var countryCode in COUNTRY_MAP) {
                    var countryName = COUNTRY_MAP[countryCode];
                    if ((countryName == country) || (countryName.toUpperCase() == country)) {
                        dat[countryCode.toLowerCase()] = 1;
                    }
                }
            };


            return dat;
        }

        $scope.regionClick = function(element, code, region) {
            var message = 'You clicked "' + region + '" which has the code: ' + code.toUpperCase();
            for (var countryCode in COUNTRY_MAP) {
                var countryName = COUNTRY_MAP[countryCode];
                // console.log('countryCode', countryCode, code);
                if (countryCode.toLowerCase() == code) {
                    $scope.selectedCountry = countryName.toUpperCase();
                }
            }
            $scope.$apply();
            console.log(message, $scope.selectedCountry, 'yyy');
        };

        $scope.currentLayout = 6;
        $scope.changeLayout = function(columns) {
            switch (columns) {
                case 2:
                    $scope.currentLayout = 6;
                    break;
                case 1:
                    $scope.currentLayout = 12;
                    break;
                case 3:
                    $scope.currentLayout = 4;
                    break;
                default:
                    $scope.currentLayout = 6;
                    break;
            }

        }

        $timeout(function() {
            $(function() {
                $('.panel')
                    .on('panel:toggle', function() {
                        var $this,
                            direction;

                        $this = $(this);
                        direction = $this.hasClass('panel-collapsed') ? 'Down' : 'Up';

                        $this.find('.panel-body, .panel-footer')['slide' + direction](200, function() {
                            $this[(direction === 'Up' ? 'add' : 'remove') + 'Class']('panel-collapsed')
                        });
                    })
                    .on('panel:dismiss', function() {
                        var $this = $(this);

                        if (!!($this.parent('div').attr('class') || '').match(/col-(xs|sm|md|lg)/g) && $this.siblings().length === 0) {
                            $row = $this.closest('.row');
                            $this.parent('div').remove();
                            if ($row.children().length === 0) {
                                $row.remove();
                            }
                        } else {
                            $this.remove();
                        }
                    })
                    .on('click', '[data-panel-toggle]', function(e) {
                        e.preventDefault();
                        $(this).closest('.panel').trigger('panel:toggle');
                    })
                    .on('click', '[data-panel-dismiss]', function(e) {
                        e.preventDefault();
                        $(this).closest('.panel').trigger('panel:dismiss');
                    })
                /* Deprecated */
                .on('click', '.panel-actions a.fa-caret-up', function(e) {
                    e.preventDefault();
                    var $this = $(this);

                    $this
                        .removeClass('fa-caret-up')
                        .addClass('fa-caret-down');

                    $this.closest('.panel').trigger('panel:toggle');
                })
                    .on('click', '.panel-actions a.fa-caret-down', function(e) {
                        e.preventDefault();
                        var $this = $(this);

                        $this
                            .removeClass('fa-caret-down')
                            .addClass('fa-caret-up');

                        $this.closest('.panel').trigger('panel:toggle');
                    })
                    .on('click', '.panel-actions a.fa-times', function(e) {
                        e.preventDefault();
                        var $this = $(this);

                        $this.closest('.panel').trigger('panel:dismiss');
                    });
            });


            var initMap = function($el, options) {

                var defaults = {
                    backgroundColor: null,
                    color: '#FFFFFF',
                    hoverOpacity: 0.7,
                    selectedColor: '#005599',
                    enableZoom: true,
                    borderWidth: 1,
                    showTooltip: true,
                    values: transformCountries(),
                    scaleColors: ['#1AA2E6', '#0088CC'],
                    normalizeFunction: 'polynomial',
                    onRegionClick: function(element, code, region) {
                        $scope.regionClick(element, code, region);
                    }
                };

                $el.vectorMap($.extend(defaults, options));
            };

            $('[data-vector-map]').each(function() {
                var $this = $(this);
                initMap($this, ($this.data('plugin-options') || {}))
            });




        });



    });
};