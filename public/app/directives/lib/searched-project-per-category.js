'use strict';
module.exports = function(m) {
    m.directive('searchedProjectsPerCategory', function(analyticsService, $timeout) {
        return {
            restrict: 'EA',

            transclude: false,
            scope: {},
            templateUrl: 'admin/directives/searched-projects-per-category.html',
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
                        content: '%x: %y Projects',
                        shifts: {
                            x: -30,
                            y: 25
                        },
                        defaultTheme: false
                    }
                };

                if (attributes.title) {
                    scope.title = attributes.title;
                } else {
                    scope.title = 'Top Searched Projects';
                }

                scope.subtitle = (attributes.subtitle) ? attributes.subtitle : '';


                if (attributes.errorinfo) {
                    scope.errorinfo = attributes.errorinfo;
                } else {
                    scope.errorinfo = 'There is no users found in this range';
                }

                var transformToPlotData = function(ret) {
                    var data = [];

                    for (var i = 0; i < ret.roles.length; i++) {
                        var view = ret.roles[i];

                        data.push([view.category, parseInt(view.searches, 10)]);
                    };
                    // console.log('data', JSON.stringify(data));

                    return [{
                        "data": data,
                        "color": "#0088cc"
                    }];

                }


                var _plotPieChart = function(ret) {


                    var total = 0;
                    var dat = [];
                    for (var i = 0; i < ret.roles.length; i++) {
                        var view = ret.roles[i];
                        total += view.searches;
                    };


                    var colors = ['#0088cc', '#2baab1', '#734ba9', '#E36159'];
                    for (var i = 0; i < ret.roles.length; i++) {
                        var view = ret.roles[i];
                        dat.push({
                            label: view.category,
                            data: [
                                [1, Math.floor(view.searches / total * 100)]
                            ],
                            color: colors[i % colors.length]
                        })
                    };
                    console.log('PIE CHART', ret, dat);

                    var plot = $.plot('#plotSearchedProjectsPieChart', dat, {
                        series: {
                            pie: {
                                show: true,
                                combine: {
                                    color: '#999',
                                    threshold: 0.1
                                }
                            }
                        },
                        legend: {
                            show: false
                        },
                        grid: {
                            hoverable: true,
                            clickable: true
                        }
                    });
                }

                var plotGraph = function(ret) {
                    scope.searchedProjects = ret;
                    var plotDat = transformToPlotData(ret);
                    $timeout(function() {
                        if (plotDat[0].data.length > 0) {
                            var plotSP = $.plot('#plotSearchedProjects', plotDat, plotOptions);
                        } else {
                            var plotSP = $.plot('#plotSearchedProjects', [
                                []
                            ], plotOptions);
                        }

                    });

                    _plotPieChart(ret);
                }

                //6. <By country>number of visitors based on Role (Manager, Engineer, Analyst)
                scope.filter = function(days) {
                    scope.currentDays = days;
                    analyticsService.seachedProjectsPerCategory({
                        country: attributes.country,
                        days: days,
                    }, function(ret) {
                        plotGraph(ret);
                    });
                };

                attributes.$observe('country', function(value) {
                    if (value) {
                        analyticsService.seachedProjectsPerCategory({
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