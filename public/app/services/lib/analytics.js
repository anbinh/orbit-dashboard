'use strict';


module.exports = function(m) {
    m.factory('analyticsService', ['$resource',
        function($resource) {

            return $resource('/api/analytics/:id', null, {

                'tenKeywordsByUser': {
                    method: 'GET',
                    'url': '/api/analytics/ten-keywords-by-user/:id/:days',
                },
                'tenUsersByCountryVisit': {
                    method: 'GET',
                    'url': '/api/analytics/ten-users-by-country-visit/:country/:days',
                },
                'tenKeywordsByCountry': {
                    method: 'GET',
                    'url': '/api/analytics/ten-keywords-by-country/:country/:days',
                },
                'visitorsRoleByCountry': {
                    method: 'GET',
                    'url': '/api/analytics/visitors-role-by-country/:country/:days',
                },
                'seachedProjectsPerCategory': {
                    method: 'GET',
                    'url': '/api/analytics/searched-projects-per-category/:country/:days',
                },
                'pageViews': {
                    method: 'GET',
                    'url': '/api/analytics/page-views/:country/:days',
                },
                'completedProjects': {
                    method: 'GET',
                    'url': '/api/analytics/completed-projects/:country/:days',
                },
                'contentPieces': {
                    method: 'GET',
                    'url': '/api/analytics/content-pieces/:country/per_week',
                }

            });
        }
    ]);
};