'use strict';
module.exports = function(m) {
    m.filter('titlecase', function() {
        return function(input) {
            var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

            input = input.toLowerCase();
            return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
                if (index > 0 && index + match.length !== title.length &&
                    match.search(smallWords) > -1 && title.charAt(index - 2) !== ':' &&
                    (title.charAt(index + match.length) !== ' - ' || title.charAt(index - 1) === ' - ') &&
                    title.charAt(index - 1).search(/[^\s-]/) < 0) {
                    return match.toLowerCase();
                }

                if (match.substr(1).search(/[A-Z]|\../) > -1) {
                    return match;
                }

                return match.charAt(0).toUpperCase() + match.substr(1);
            });
        };
    }).filter('storename', function() {
        return function(input) {
            if (input !== undefined) {
                return input.split('-').join(' ');
            } else {
                return '';
            }

        };
    }).filter('fullname', function() {
        return function(user) {

            if ((user.first_name !== undefined) && (user.last_name !== undefined)) {
                return user.first_name + ' ' + user.last_name;
            } else {
                return user.email;
            }

        };
    }).filter('dashboardProfile', function() {
        return function(user) {

            return '/dashboard/#/user-profile/' + user.id;

        };
    }).filter('dashboardDealerProfile', function() {
        return function(user) {

            return '/dashboard/#/dealer-profile/' + user.id;

        };
    });
};