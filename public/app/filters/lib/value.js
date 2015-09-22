'use strict';
module.exports = function(m) {
    m.filter('cardvalue', function() {
        return function(cards, minD, maxD) {
            // console.log("FILTER STORE", minD, maxD);
            var filteredCards = [];

            for (var i = 0; i < cards.length; i = i + 1) {
                var store = cards[i];

                if (minD <= store.value && store.value <= maxD) {
                    filteredCards.push(store);
                }
            }

            return filteredCards;
        };
    });
};