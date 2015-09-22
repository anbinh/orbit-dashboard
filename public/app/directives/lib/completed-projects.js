'use strict';
module.exports = function(m) {
    m.directive('completedProjects', function(analyticsService) {
        return {
            restrict: 'EA',

            transclude: false,
            scope: {},
            templateUrl: 'admin/directives/completed-projects.html',
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
                    scope.title = 'Top Completed Projects';
                }

                scope.subtitle = (attributes.subtitle) ? attributes.subtitle : '';

                if (attributes.errorinfo) {
                    scope.errorinfo = attributes.errorinfo;
                } else {
                    scope.errorinfo = 'There is no completed projects found in this range';
                }


                //6. <By country>number of visitors based on Role (Manager, Engineer, Analyst)
                scope.filter = function(days) {
                    scope.currentDays = days;
                    analyticsService.completedProjects({
                        country: attributes.country,
                        days: days,
                    }, function(ret) {
                        scope.completedProjects = ret.count;
                    });
                };

                attributes.$observe('country', function(value) {
                    if (value) {
                        analyticsService.completedProjects({
                            country: value,
                            days: scope.options.selectedFilter.days,
                        }, function(ret) {
                            scope.completedProjects = ret.count;
                        });

                    }
                });

            }
        };
    });
};