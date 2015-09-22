'use strict';
module.exports = function(m) {
    m.directive('contentPieces', function(analyticsService) {
        return {
            restrict: 'EA',

            transclude: false,
            scope: {},
            templateUrl: 'admin/directives/content-pieces.html',
            link: function(scope, element, attributes) {


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
                        content: '%x: %y Pieces of Content',
                        shifts: {
                            x: -30,
                            y: 25
                        },
                        defaultTheme: false
                    }
                };
                var transformToPlotData = function(ret) {
                    var data = [];

                    for (var i = 0; i < ret.stats.length; i++) {
                        var view = ret.stats[i];

                        data.push(['Week ' + view._id.week + ' of ' + view._id.year, parseInt(view.total, 10)]);
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
                    scope.title = 'Top Content Pieces';
                }

                scope.subtitle = (attributes.subtitle) ? attributes.subtitle : '';

                if (attributes.errorinfo) {
                    scope.errorinfo = attributes.errorinfo;
                } else {
                    scope.errorinfo = 'There is no content pieces found in this range';
                }

                var plotGraph = function(ret) {
                    scope.contentPieces = ret;
                    var plotDat = transformToPlotData(ret);
                    if (plotDat[0].data.length > 0) {
                        var plotSP = $.plot('#plotContentPieces', plotDat, plotOptions);
                    } else {
                        var plotSP = $.plot('#plotContentPieces', [
                            []
                        ], plotOptions);
                    }
                }

                //6. <By country>number of visitors based on Role (Manager, Engineer, Analyst)
                scope.filter = function(days) {
                    scope.currentDays = days;
                    analyticsService.contentPieces({
                        country: attributes.country,
                        days: "per_week",
                    }, function(ret) {
                        plotGraph(ret);
                    });
                };

                attributes.$observe('country', function(value) {
                    if (value) {
                        analyticsService.contentPieces({
                            country: value,
                            days: "per_week",
                        }, function(ret) {
                            plotGraph(ret);
                        });

                    }
                });

            }
        };
    });
};