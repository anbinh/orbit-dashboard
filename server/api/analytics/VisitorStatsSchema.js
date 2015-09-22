'use strict';

var mongoose = require('mongoose');

var VisitorStatsSchema = new mongoose.Schema({
    user_id: {
        type: String,
        default: false,
        index: true
    },
    role: {
        type: String,
        default: false,
        index: true
    },
    job_role: {
        type: String,
        default: false,
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

module.exports = mongoose.model('VisitorStats', VisitorStatsSchema);