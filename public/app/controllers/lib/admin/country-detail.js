'use strict';


module.exports = function(m) {
    m.controller('AdminCountryDetailController', function($scope, $rootScope, store, $location, authService, $timeout, analyticsService, utilService, SelectedCountry) {

        authService.adminAuthenticate();

        $rootScope.$broadcast('CHANGE_SIDEBAR_ITEM', 'countries', SelectedCountry);


        $scope.selectedCountry = SelectedCountry;



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
        });



    });
};