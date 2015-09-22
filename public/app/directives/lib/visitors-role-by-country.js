'use strict';
module.exports = function(m) {
    m.directive('visitorsRole', function(analyticsService) {
        return {
            restrict: 'EA',

            transclude: false,
            scope: {},
            templateUrl: 'admin/directives/visitors-role-by-country.html',
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

                    for (var i = 0; i < ret.roles.length; i++) {
                        var view = ret.roles[i];

                        data.push([view.role, parseInt(view.count, 10)]);
                    };
                    // console.log('data', JSON.stringify(data));

                    return [{
                        "data": data,
                        "color": "#0088cc"
                    }];

                }
                if (attributes.title) {
                    scope.title = attributes.title;
                } else {
                    scope.title = 'Top 10 Visitors';
                }

                scope.subtitle = (attributes.subtitle) ? attributes.subtitle : '';

                if (attributes.errorinfo) {
                    scope.errorinfo = attributes.errorinfo;
                } else {
                    scope.errorinfo = 'There is no users found in this range';
                }

                var plotGraph = function(ret) {
                    scope.visitorsRoleByCountry = ret;
                    var plotDat = transformToPlotData(ret);
                    if (plotDat[0].data.length > 0) {
                        var plotSP = $.plot('#plotVisitorsRole', plotDat, plotOptions);
                    } else {
                        var plotSP = $.plot('#plotVisitorsRole', [
                            []
                        ], plotOptions);
                    }
                }

                //6. <By country>number of visitors based on Role (Manager, Engineer, Analyst)
                scope.filter = function(days) {
                    scope.currentDays = days;
                    analyticsService.visitorsRoleByCountry({
                        country: attributes.country,
                        days: days,
                    }, function(ret) {
                        plotGraph(ret);
                    });
                };

                attributes.$observe('country', function(value) {
                    if (value) {
                        analyticsService.visitorsRoleByCountry({
                            country: value,
                            days: scope.options.selectedFilter.days,
                        }, function(ret) {
                            plotGraph(ret);
                        });

                    }
                });

            }
        };
    });
};