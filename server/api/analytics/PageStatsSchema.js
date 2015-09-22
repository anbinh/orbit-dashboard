'use strict';

var mongoose = require('mongoose');

var PageStatsSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0,
        index: true
    },
    country: {
        type: String,
        default: false,
        index: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    },
});

module.exports = mongoose.model('PageStats', PageStatsSchema);