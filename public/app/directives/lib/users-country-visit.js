'use strict';
module.exports = function(m) {
    m.directive('usersCountryVisit', function(analyticsService) {
        return {
            restrict: 'EA',

            transclude: false,
            scope: {},
            templateUrl: 'admin/directives/users-country-visit.html',
            link: function(scope, element, attributes) {

                scope.currentDays = '-1';


                scope.options = {
                    filters: [{
                        name: 'Today',
                        days: 1
                    }, {
                        name: 'Last Week',
                        days: 7
                    }, {
                        name: 'Last Month',
                        days: 30
                    }, {
                        name: 'Last Year',
                        days: 365
                    }, {
                        name: 'All Time',
                        days: -1
                    }],
                    selectedFilter: {
                        name: 'All Time',
                        days: -1
                    }
                }

                if (attributes.title) {
                    scope.title = attributes.title;
                } else {
                    scope.title = 'Top 10 Users';
                }

                scope.subtitle = (attributes.subtitle) ? attributes.subtitle : '';

                if (attributes.errorinfo) {
                    scope.errorinfo = attributes.errorinfo;
                } else {
                    scope.errorinfo = 'There is no users found in this range';
                }

                var plotOptions = {
                    series: {
                        bars: {
                            show: true,
                            lineWidth: 0,
                            align: 'center',
                            barWidth: 0.9,
                            fillColor: '#ed9c28'
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
                        content: '%x: %y Visits',
                        shifts: {
                            x: -30,
                            y: 25
                        },
                        defaultTheme: false
                    }
                };
                var transformToPlotData = function(ret) {
                    var data = [];

                    for (var i = 0; i < ret.users.length; i++) {
                        var view = ret.users[i];

                        data.push([view.user.name, parseInt(view.visits, 10)]);
                    };
                    // console.log('keyqord data', JSON.stringify(data));

                    return [{
                        "data": data,
                        "color": "#0088cc"
                    }];

                };


                var plotGraph = function(ret) {
                    scope.usersByCountryVisits = ret;
                    var plotDat = transformToPlotData(ret);
                    if (plotDat[0].data.length > 0) {
                        var plotSP = $.plot('#plotUsersVisit', plotDat, plotOptions);
                    } else {
                        var plotSP = $.plot('#plotUsersVisit', [
                            []
                        ], plotOptions);
                    }
                }

                //2. <By country> top 10 users  - based on number of visits

                scope.filter = function(days) {
                    scope.currentDays = days;
                    analyticsService.tenUsersByCountryVisit({
                        country: attributes.country,
                        days: days,
                    }, function(ret) {
                        plotGraph(ret);
                    });
                };

                attributes.$observe('country', function(value) {
                    if (value) {

                        analyticsService.tenUsersByCountryVisit({
                            country: value,
                            days: scope.options.selectedFilter.days,
                        }, function(ret) {
                            plotGraph(ret);
                        });

                    }
                });

                scope.goToUserDetail = function(id) {
                    window.location = '/#/users/' + id;
                }

            }
        };
    });
};