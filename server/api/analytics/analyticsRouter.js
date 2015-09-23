'use strict';

var express = require('express');
var router = express.Router();
var async = require('async');
var moment = require('moment');


var KeywordStats = require('./KeywordStatsSchema');
var ProjectStats = require('./ProjectStatsSchema');
var VisitorStats = require('./VisitorStatsSchema');
var PageStats = require('./PageStatsSchema');
var Users = require('../users/usersSchema');
var Projects = require('./projectSchema');
var Questions = require('./questionsSchema');

//1. <By User> top 10 keyword search per user
router.get('/ten-keywords-by-user/:id/:days', function(req, res, next) {


    console.log(req.params);

    console.log();

    var LIMIT = 10;
    var createdAtCriteria;



    if (req.params.days == '-1') {
        createdAtCriteria = {
            $gte: new Date(-8640000000000000),
            $lt: new Date()
        };
    } else {
        createdAtCriteria = {
            $gte: moment().subtract(req.params.days, 'days').toDate(),
            $lt: new Date()
        };
    }


    async.parallel({
            keywords: function(callback) {
                KeywordStats.aggregate([{
                    $match: {
                        user_id: req.params.id,
                        created_at: createdAtCriteria
                    }
                }, {
                    $group: {
                        _id: {
                            "user_id": "$user_id",
                            "keyword": "$name"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }, {
                    $sort: {
                        count: -1
                    }
                }, {
                    $limit: LIMIT
                }], function(err, ret) {
                    if (err) return next(err);

                    var dat = [];
                    for (var i = 0; i < ret.length; i++) {
                        var item = {
                            keyword: ret[i]._id.keyword,
                            count: ret[i].count
                        };
                        dat.push(item);

                    };

                    callback(null, dat);
                });
            },
            user: function(callback) {
                Users.findById(req.params.id, function(err, user) {
                    if (err) return next(err);

                    callback(null, user);
                });
            }
        },
        function(err, results) {
            res.json(results);
        });


});


// 2. <By country> top 10 users  - based on number of visits
router.get('/ten-users-by-country-visit/:name/:days', function(req, res, next) {


    console.log(req.params);

    var LIMIT = 10;
    var createdAtCriteria;

    if (req.params.days == '-1') {
        createdAtCriteria = {
            $gte: new Date(-8640000000000000),
            $lt: new Date()
        };
    } else {
        createdAtCriteria = {
            $gte: moment().subtract(req.params.days, 'days').toDate(),
            $lt: new Date()
        };
    }


    async.parallel({
            users: function(callback) {
                VisitorStats.aggregate([{
                    $match: {
                        country: req.params.name,
                        created_at: createdAtCriteria
                    }
                }, {
                    $group: {
                        _id: {
                            "user": "$user_id"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }, {
                    $sort: {
                        count: -1
                    }
                }, {
                    $limit: LIMIT
                }], function(err, ret) {
                    if (err) return next(err);

                    var dat = [];
                    var userIds = [];
                    for (var i = 0; i < ret.length; i++) {
                        var item = {
                            user_id: ret[i]._id.user,
                            visits: ret[i].count
                        };
                        userIds.push(item.user_id);
                        dat.push(item);

                    };

                    Users.find({
                        _id: {
                            $in: userIds
                        }
                    }, function(err, users) {
                        if (err) return next(err);

                        for (var i = 0; i < users.length; i++) {
                            var currentUser = users[i];
                            for (var j = 0; j < dat.length; j++) {
                                var stat = dat[j];
                                if (stat.user_id == currentUser._id) {
                                    dat[j].user = currentUser;
                                }
                            };
                        };

                        // delete user_id
                        for (var i = 0; i < dat.length; i++) {
                            delete dat[i].user_id;
                        };

                        callback(null, dat);
                    })


                });
            },
            country: function(callback) {
                callback(null, req.params.name);
            }
        },
        function(err, results) {
            res.json(results);
        }
    );


});

// 3. <By country> number of page views per day and week
router.get('/page-views/:name/:option', function(req, res, next) {


    console.log(req.params);

    var LIMIT = 30;
    var criteria;

    if (req.params.option == 'per_day') {
        criteria = [{
            $match: {
                country: req.params.name
            }
        }, {
            $group: {
                _id: {
                    "year": {
                        $year: "$created_at"
                    },
                    "month": {
                        $month: "$created_at"
                    },
                    "date": {
                        $dayOfMonth: "$created_at"
                    }
                },
                count: {
                    $sum: "$count"
                }
            }
        }, {
            $sort: {
                "_id.year": -1,
                "_id.month": -1,
                "_id.date": -1
            }
        }, {
            $limit: LIMIT
        }];
    } else {
        criteria = [{
            $match: {
                country: req.params.name
            }
        }, {
            $group: {
                _id: {
                    "year": {
                        $year: "$created_at"
                    },
                    "week": {
                        $week: "$created_at"
                    }
                },
                count: {
                    $sum: "$count"
                }
            }
        }, {
            $sort: {
                "_id.year": 1,
                "_id.week": 1,
            }
        }, {
            $limit: LIMIT
        }];
    }


    async.parallel({
            views: function(callback) {
                PageStats.aggregate(criteria, function(err, ret) {
                    if (err) return next(err);


                    callback(null, ret);


                });
            },
            country: function(callback) {
                callback(null, req.params.name);
            }
        },
        function(err, results) {
            res.json(results);
        }
    );


});

//4. <By country> top 10 keyword search
router.get('/ten-keywords-by-country/:name/:days', function(req, res, next) {


    console.log(req.params);

    var LIMIT = 10;
    var createdAtCriteria;

    if (req.params.days == '-1') {
        createdAtCriteria = {
            $gte: new Date(-8640000000000000),
            $lt: new Date()
        };
    } else {
        createdAtCriteria = {
            $gte: moment().subtract(req.params.days, 'days').toDate(),
            $lt: new Date()
        };
    }

    async.parallel({
            keywords: function(callback) {
                KeywordStats.aggregate([{
                    $match: {
                        country: req.params.name,
                        created_at: createdAtCriteria
                    }
                }, {
                    $group: {
                        _id: {
                            "country": "$country",
                            "keyword": "$name"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }, {
                    $sort: {
                        count: -1
                    }
                }, {
                    $limit: LIMIT
                }], function(err, ret) {
                    if (err) return next(err);

                    var dat = [];
                    for (var i = 0; i < ret.length; i++) {
                        var item = {
                            keyword: ret[i]._id.keyword,
                            count: ret[i].count
                        };
                        dat.push(item);

                    };

                    callback(null, dat);
                });
            },
            country: function(callback) {
                callback(null, req.params.name);
            }
        },
        function(err, results) {
            res.json(results);
        });


});

//6. <By country>number of visitors based on Role (Manager, Engineer, Analyst)
router.get('/visitors-role-by-country/:name/:days', function(req, res, next) {


    console.log(req.params);

    var LIMIT = 10;
    var createdAtCriteria;

    if (req.params.days == '-1') {
        createdAtCriteria = {
            $gte: new Date(-8640000000000000),
            $lt: new Date()
        };
    } else {
        createdAtCriteria = {
            $gte: moment().subtract(req.params.days, 'days').toDate(),
            $lt: new Date()
        };
    }


    async.parallel({
            roles: function(callback) {
                VisitorStats.aggregate([{
                    $match: {
                        country: req.params.name,
                        created_at: createdAtCriteria
                    }
                }, {
                    $group: {
                        _id: {
                            "role": "$job_role"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }, {
                    $sort: {
                        count: -1
                    }
                }, {
                    $limit: LIMIT
                }], function(err, ret) {
                    if (err) return next(err);

                    var dat = [];
                    for (var i = 0; i < ret.length; i++) {
                        var item = {
                            role: ret[i]._id.role,
                            count: ret[i].count
                        };
                        dat.push(item);

                    };

                    callback(null, dat);

                });
            },
            country: function(callback) {
                callback(null, req.params.name);
            }
        },
        function(err, results) {
            res.json(results);
        }
    );


});

//7. <By country>number of searched projects listed per category
router.get('/searched-projects-per-category/:name/:days', function(req, res, next) {


    console.log(req.params);

    var LIMIT = 10;
    var createdAtCriteria;

    if (req.params.days == '-1') {
        createdAtCriteria = {
            $gte: new Date(-8640000000000000),
            $lt: new Date()
        };
    } else {
        createdAtCriteria = {
            $gte: moment().subtract(req.params.days, 'days').toDate(),
            $lt: new Date()
        };
    }


    async.parallel({
            roles: function(callback) {
                ProjectStats.aggregate([{
                    $match: {
                        country: req.params.name,
                        created_at: createdAtCriteria
                    }
                }, {
                    $group: {
                        _id: {
                            "category": "$category"
                        },
                        count: {
                            $sum: "$project_count"
                        }
                    }
                }, {
                    $sort: {
                        count: -1
                    }
                }, {
                    $limit: LIMIT
                }], function(err, ret) {
                    if (err) return next(err);

                    var dat = [];
                    for (var i = 0; i < ret.length; i++) {
                        var item = {
                            category: ret[i]._id.category,
                            searches: ret[i].count
                        };
                        dat.push(item);

                    };

                    callback(null, dat);

                });
            },
            country: function(callback) {
                callback(null, req.params.name);
            }
        },
        function(err, results) {
            res.json(results);
        }
    );


});

//8. <By country> number of projects completed
router.get('/completed-projects/:name/:days', function(req, res, next) {


    console.log(req.params);

    var LIMIT = 10;
    var updatedDateCriteria;

    if (req.params.days == '-1') {
        updatedDateCriteria = {
            $gte: new Date(-8640000000000000),
            $lt: new Date()
        };
    } else {
        updatedDateCriteria = {
            $gte: moment().subtract(req.params.days, 'days').toDate(),
            $lt: new Date()
        };
    }

    Projects.count({
        updatedDate: updatedDateCriteria,
        country: req.params.name,
        status: 'Completed'
    }, function(err, count) {

        res.json({
            count: count
        });

    })
});

// 5. <By country>number of pieces of content (including comments on projects, 
// invitations, acceptance, change of project status to completed) per week
router.get('/content-pieces/:name/:option', function(req, res, next) {


    console.log(req.params);

    var LIMIT = 30;
    var criteria, criteria2;

    criteria = [{
        $project: {
            item: 1,
            country: 1,
            numberOfInvitation: {
                $size: "$invitedUsers"
            },
            numberOfAcceptance: {
                $size: "$selectedUsers"
            },
            numberOfCompletedProjects: {
                $cond: {
                    if :{
                        $eq: ["$status", 'Completed']
                    }, then: 1,
                    else :0
                },
            },
            updatedDate: 1
        }
    }, {
        $match: {
            country: req.params.name
        }
    }, {
        $group: {
            _id: {
                "year": {
                    $year: "$updatedDate"
                },
                "week": {
                    $week: "$updatedDate"
                }
            },
            invitation: {
                $sum: '$numberOfInvitation'
            },
            acceptance: {
                $sum: '$numberOfAcceptance'
            },
            completion: {
                $sum: '$numberOfCompletedProjects'
            }
        }
    }, {
        $sort: {
            "_id.year": 1,
            "_id.week": 1,
        }
    }, {
        $limit: LIMIT
    }];

    criteria2 = [{
        $match: {
            country: req.params.name
        }
    }, {
        $group: {
            _id: {
                "year": {
                    $year: "$createdDate"
                },
                "week": {
                    $week: "$createdDate"
                }
            },
            comments: {
                $sum: 1
            }
        }
    }, {
        $sort: {
            "_id.year": 1,
            "_id.week": 1,
        }
    }, {
        $limit: LIMIT
    }];

    async.parallel({
            stats1: function(callback) {
                Projects.aggregate(criteria, function(err, ret) {
                    if (err) return next(err);


                    callback(null, ret);


                });
            },
            stats2: function(callback) {
                Questions.aggregate(criteria2, function(err, ret) {
                    if (err) return next(err);


                    callback(null, ret);


                });
            },
            country: function(callback) {
                callback(null, req.params.name);
            }
        },
        function(err, results) {

            var dat = [];

            for (var i = 0; i < results.stats1.length; i++) {
                var stat1 = results.stats1[i];
                for (var j = 0; j < results.stats2.length; j++) {
                    var stat2 = results.stats2[j];
                    if ((stat1._id.year === stat2._id.year) && ((stat1._id.month === stat2._id.month))) {

                        dat.push({
                            _id: stat1._id,
                            invitation: stat1.invitation,
                            acceptance: stat1.acceptance,
                            completion: stat1.completion,
                            comments: stat2.comments,
                            total: stat1.invitation + stat1.acceptance + stat1.completion + stat2.comments
                        })

                    }
                };
            };
            res.json({
                country: results.country,
                stats: dat
            });

        }
    );


});

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function addKeywordStat(user) {
    KeywordStats.remove({}, function() {
        var keywords = ["css", "js", "angularjs", "html", 'node', 'nodejs', "angularjs", 'projects', 'cars', 'design', 'test', 'yes', 'no', 'projects', 'html', 'css', 'css', 'css'];
        var dateRange = getRandomArbitrary(31, 40);
        for (var j = 0; j < dateRange; j++) {

            var todayTimes = getRandomArbitrary(1, 20);

            for (var k = 0; k < todayTimes; k++) {

                var index = getRandomArbitrary(0, keywords.length - 1);
                var keyName = keywords[index];

                var keywordStat = {
                    "created_at": moment().subtract(j, 'days').toDate(),
                    "country": user.country,
                    "job_role": user.job_role,
                    "role": user.role,
                    "user_id": user._id,
                    "name": keyName
                };

                console.log('keyname', user.country, user.job_role, keyName);

                KeywordStats.create(keywordStat);
            };

        };
    });
}

function addVisitorStats(user) {
    VisitorStats.remove({}, function() {
        var dateRange = getRandomArbitrary(31, 40);
        for (var j = 0; j < dateRange; j++) {

            var todayTimes = getRandomArbitrary(1, 20);

            for (var k = 0; k < todayTimes; k++) {


                var keywordStat = {
                    "created_at": moment().subtract(j, 'days').toDate(),
                    "country": user.country,
                    "job_role": user.job_role,
                    "role": user.role,
                    "user_id": user._id
                };

                console.log('keyname', user.country, user.job_role);

                VisitorStats.create(keywordStat);
            };

        };
    });
}

function addProjectStats(user) {
    ProjectStats.remove({}, function() {
        var categories = ["Business", "IT", "Security", "Operations", "Operations", "IT", "IT", "Security", "Security", "Security"];
        var keywords = ["css", "js", "angularjs", "html", 'node', 'nodejs', "angularjs", 'projects', 'cars', 'design', 'test', 'yes', 'no', 'projects', 'html', 'css', 'css', 'css'];
        var dateRange = getRandomArbitrary(31, 40);
        for (var j = 0; j < dateRange; j++) {

            var todayTimes = getRandomArbitrary(1, 20);

            for (var k = 0; k < todayTimes; k++) {


                var keyName = keywords[getRandomArbitrary(0, keywords.length - 1)];
                var catName = categories[getRandomArbitrary(0, categories.length - 1)];

                var keywordStat = {
                    "created_at": moment().subtract(j, 'days').toDate(),
                    "country": user.country,
                    "project_count": getRandomArbitrary(1, 40),
                    "category": catName,
                    "user_id": user._id,
                    "keyword": keyName
                };

                ProjectStats.create(keywordStat);
            };

        };
    });
}

function addPageViews(user) {
    PageStats.remove({}, function() {


        var dateRange = getRandomArbitrary(31, 40);
        for (var j = 0; j < dateRange; j++) {

            var todayTimes = getRandomArbitrary(1, 20);

            for (var k = 0; k < todayTimes; k++) {

                var keywordStat = {
                    "created_at": moment().subtract(j, 'days').toDate(),
                    "country": user.country,
                    "count": getRandomArbitrary(10, 100)
                };

                PageStats.create(keywordStat);
            };

        };
    });
}


router.get('/fake-data', function(req, res, next) {


    Users.find({}, function(err, users) {
        console.log(users, users);

        for (var i = 0; i < users.length; i++) {
            var user = users[i];

            // console.log('CUNTRY', user.country);

            addKeywordStat(user);
            addVisitorStats(user);
            addProjectStats(user);
            addPageViews(user);

        };

        res.json({
            time: new Date()
        })
    })


});


module.exports = router;