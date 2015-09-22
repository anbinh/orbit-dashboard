'use strict';
module.exports = function(m) {
    m.filter('discount', function() {
        return function(stores, minD, maxD) {
            // console.log("FILTER STORE", minD, maxD);
            var filteredStores = [];

            for (var i = 0; i < stores.length; i = i + 1) {
                var store = stores[i];

                if (minD <= store.discount && store.discount <= maxD) {
                    filteredStores.push(store);
                }
            }

            return filteredStores;
        };
    });
};