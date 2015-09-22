'use strict';


module.exports = function(m) {
    m.controller('AdminUserDetailController', function($scope, $rootScope, store, $location, authService, Keywords, userService, $timeout, analyticsService, $routeParams) {

        authService.adminAuthenticate();

        $rootScope.$broadcast('CHANGE_SIDEBAR_ITEM', 'users', '');

        var plotOptions = {
            series: {
                bars: {
                    show: true,
                    lineWidth: 2,
                    align: 'center',
                    barWidth: 0.9
                },
                shadowSize: 0
            },
            grid: {
                hoverable: true,
                clickable: true,
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: 1,
                labelMargin: 15,
                backgroundColor: 'transparent'
            },
            yaxis: {
                color: 'rgba(0,0,0,0.1)'

            },
            xaxis: {
                mode: 'categories',
                color: 'rgba(0,0,0,0)'
            },
            legend: {
                show: false
            },
            tooltip: true,
            tooltipOpts: {
                content: '%x: %y Appearances',
                shifts: {
                    x: -30,
                    y: 25
                },
                defaultTheme: false
            }
        };
        var transformToPlotData = function(ret) {
            var data = [];

            for (var i = 0; i < ret.keywords.length; i++) {
                var view = ret.keywords[i];

                data.push([view.keyword, parseInt(view.count, 10)]);
            };

            return [{
                "data": data,
                "color": "#0088cc"
            }];

        };


        var plotGraph = function(ret) {
            $scope.keywords = ret.keywords;
            var plotDat = transformToPlotData(ret);
            console.log('plot dat', plotDat);
            if (plotDat[0].data.length > 0) {
                var plotSP = $.plot('#plotTopKeywords', plotDat, plotOptions);
            } else {
                var plotSP = $.plot('#plotTopKeywords', [
                    []
                ], plotOptions);
            }
        };

        $scope.currentDays = -1;
        $scope.user = Keywords.user;
        $scope.keywords = Keywords.keywords;
        $timeout(function() {
            plotGraph(Keywords);
        })



        $scope.filter = function(days) {
            $scope.currentDays = days;
            analyticsService.tenKeywordsByUser({
                id: $routeParams.id,
                days: days
            }, function(keywords) {
                $scope.currentDays = days;
                plotGraph(keywords);
            });
        };




    });
};