'use strict';
module.exports = function(m) {
    m.directive('pageViews', function(analyticsService, $timeout) {
        return {
            restrict: 'EA',

            transclude: false,
            scope: {},
            templateUrl: 'admin/directives/page-views.html',
            link: function(scope, element, attributes) {


                scope.options = {
                    filters: [{
                        name: 'Per day',
                        days: 'per_day'
                    }, {
                        name: 'Per week',
                        days: 'per_week'
                    }],
                    selectedFilter: {
                        name: 'Per day',
                        days: 'per_day'
                    }
                }

                if (attributes.title) {
                    scope.title = attributes.title;
                } else {
                    scope.title = 'Top Page Views';
                }

                scope.subtitle = (attributes.subtitle) ? attributes.subtitle : '';


                if (attributes.errorinfo) {
                    scope.errorinfo = attributes.errorinfo;
                } else {
                    scope.errorinfo = 'There is no users found in this range';
                }

                var plotOptions = {

                    series: {
                        lines: {
                            show: true,
                            lineWidth: 2
                        },
                        points: {
                            show: true
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
                        min: 0,
                        color: 'rgba(0,0,0,0.1)'
                    },
                    xaxis: {
                        mode: 'time',
                        color: 'rgba(0,0,0,0)'
                    },
                    legend: {
                        show: false
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: '%x: %y views',
                        shifts: {
                            x: -30,
                            y: 25
                        },
                        defaultTheme: false
                    }
                };

                var transformTimeSeries = function(ret) {
                    var data = [];

                    if (scope.options.selectedFilter.days == 'per_day') {
                        for (var i = 0; i < ret.views.length; i++) {
                            var view = ret.views[i];
                            // console.log(view);
                            var ts = new Date(view._id.year + "/" + view._id.month + "/" + view._id.date);
                            data.push([ts.getTime(), view.count]);
                        };

                        plotOptions.xaxis.mode = 'time';
                        plotOptions.tooltipOpts.content = '%x: %y views';

                        // console.log('data', data);
                        return data;
                    } else {
                        for (var i = 0; i < ret.views.length; i++) {
                            var view = ret.views[i];
                            console.log(view);
                            data.push(["#" + view._id.week + ' of ' + view._id.year, view.count]);
                        };
                        plotOptions.xaxis.mode = 'categories';
                        plotOptions.tooltipOpts.content = 'Week %x: %y views';
                        // console.log('data', data);
                        return data;
                    }

                }


                var plotGraph = function(ret) {
                    scope.pageViews = ret;
                    var plotDat = transformTimeSeries(ret);
                    if (plotDat.length > 0) {
                        scope.plotPageViews = $.plot('#plotPageViews', [plotDat], plotOptions);
                    } else {
                        scope.plotPageViews = $.plot('#plotPageViews', [
                            [
                                []
                            ]
                        ], plotOptions);
                    }
                }


                //3.<By country> number of page views per day and week

                scope.filter = function(days) {
                    scope.currentDays = days;
                    analyticsService.pageViews({
                        country: attributes.country,
                        days: days,
                    }, function(ret) {
                        plotGraph(ret);
                    });
                };

                attributes.$observe('country', function(value) {
                    if (value) {
                        analyticsService.pageViews({
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