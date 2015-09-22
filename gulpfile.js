var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var minifyCSS = require("gulp-minify-css");
var minifyHTML = require("gulp-minify-html");
var runSequence = require('run-sequence');
var templateCache = require('gulp-angular-templatecache');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');

var _dist = "./public/dist";
var _src = "./public/app";

/* Clean the build directory */
gulp.task('clean', function(cb) {
    del([_dist + "/**"], cb);
});


gulp.task('deps', function() {
    // regular website
    gulp.src([
        "./public/vendor/jquery/jquery.js",
        "./public/vendor/jquery.appear/jquery.appear.js",
        "./public/vendor/jquery.easing/jquery.easing.js",
        "./public/vendor/jquery-cookie/jquery-cookie.js",
        "./public/vendor/bootstrap/bootstrap.js",
        "./public/vendor/common/common.js",
        "./public/vendor/jquery.validation/jquery.validation.js",
        "./public/vendor/jquery.stellar/jquery.stellar.js",
        "./public/vendor/jquery.easy-pie-chart/jquery.easy-pie-chart.js",
        "./public/vendor/jquery.gmap/jquery.gmap.js",
        "./public/vendor/isotope/jquery.isotope.js",
        "./public/vendor/owlcarousel/owl.carousel.js",
        "./public/vendor/jflickrfeed/jflickrfeed.js",
        "./public/vendor/magnific-popup/jquery.magnific-popup.js",
        "./public/vendor/vide/vide.js",
        "./public/vendor/rs-plugin/js/jquery.themepunch.tools.min.js",
        "./public/vendor/rs-plugin/js/jquery.themepunch.revolution.min.js",
        "./public/vendor/circle-flip-slideshow/js/jquery.flipshow.js",
        "./public/js/theme.js",
        "./public/js/views/view.home.js",
        "./public/js/custom.js",
        "./public/js/theme.init.js",
        "./public/vendor/angular/angular.min.js",
        "./public/vendor/angular-cookies/angular-cookies.min.js",
        "./public/vendor/angular-route/angular-route.min.js",
        "./public/vendor/angular-resource/angular-resource.min.js",
        "./public/vendor/a0-angular-storage/dist/angular-storage.js",
        "./public/vendor/angular-bootstrap/ui-bootstrap-tpls-0.13.0.min.js",
        "./public/vendor/sweetalert/dist/sweetalert.min.js",
        "./public/vendor/angular-sweetalert/SweetAlert.min.js",
        "./public/vendor/nouislider/jquery.nouislider.js",
        "./public/vendor/nouislider/Link.js"

    ])
        .pipe(uglify())
        .pipe(concat("dep.min.js"))
        .pipe(gulp.dest(_dist + "/"));


    // admin
    gulp.src([
        "./public/vendor/jquery/jquery.js",
        "./public/vendor/jquery-browser-mobile/jquery.browser.mobile.js",
        "./public/vendor/bootstrap/js/bootstrap.js",
        "./public/vendor/nanoscroller/nanoscroller.js",
        "./public/vendor/bootstrap-datepicker/js/bootstrap-datepicker.js",
        "./public/vendor/magnific-popup/magnific-popup.js",
        "./public/vendor/query-placeholder/jquery.placeholder.js",
        "./public/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.js",
        "./public/vendor/jquery-ui-touch-punch/jquery.ui.touch-punch.js",
        "./public/vendor/jquery-appear/jquery.appear.js",
        "./public/vendor/bootstrap-multiselect/bootstrap-multiselect.js",
        "./public/vendor/jquery-easypiechart/jquery.easypiechart.js",
        "./public/vendor/flot/jquery.flot.js",
        "./public/vendor/flot-tooltip/jquery.flot.tooltip.js",
        "./public/vendor/flot/jquery.flot.pie.js",
        "./public/vendor/flot/jquery.flot.time.js",
        "./public/vendor/flot/jquery.flot.categories.js",
        "./public/vendor/flot/jquery.flot.resize.js",
        "./public/vendor/jquery-sparkline/jquery.sparkline.js",
        "./public/vendor/raphael/raphael.js",
        "./public/vendor/morris/morris.js",
        "./public/vendor/gauge/gauge.js",
        "./public/vendor/snap-svg/snap.svg.js",
        "./public/vendor/liquid-meter/liquid.meter.js",


        "./public/vendor/select2/select2.js",
        "./public/vendor/jquery-datatables/media/js/jquery.dataTables.js",
        "./public/vendor/jquery-datatables/extras/TableTools/js/dataTables.tableTools.min.js",
        "./public/vendor/jquery-datatables-bs3/assets/js/datatables.js",


        "./public/javascripts/theme.js",
        "./public/javascripts/theme.custom.js",
        "./public/javascripts/theme.init.js",
        "./public/javascripts/dashboard/examples.dashboard.js",

        "./public/vendor/angular/angular.min.js",
        "./public/vendor/angular-cookies/angular-cookies.min.js",
        "./public/vendor/angular-route/angular-route.min.js",
        "./public/vendor/angular-resource/angular-resource.min.js",
        "./public/vendor/a0-angular-storage/dist/angular-storage.js",
        "./public/vendor/angular-bootstrap/ui-bootstrap-tpls-0.13.0.min.js",
        "./public/vendor/sweetalert/dist/sweetalert.min.js",
        "./public/vendor/angular-sweetalert/SweetAlert.min.js",
        "./public/vendor/nouislider/jquery.nouislider.js",
        "./public/vendor/nouislider/Link.js",
        "./public/vendor/angular-nouislider/src/nouislider.js",

        "./public/vendor/store-js/store.js",


        "./public/vendor/jqvmap/jquery.vmap.js",
        "./public/vendor/jqvmap/maps/jquery.vmap.world.js",
        "./public/vendor/jqvmap/data/jquery.vmap.sampledata.js"


    ])
        .pipe(uglify())
        .pipe(concat("admin.dep.min.js"))
        .pipe(gulp.dest(_dist + "/"));
});

/* Build the javascripts */
gulp.task('jshint', function() {
    return gulp.src(_src + "/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', ['jshint'], function() {
    return browserify(_src + "/app.js")
        .bundle()
        .pipe(source("app.min.js"))
        .pipe(buffer())
        //        .pipe(uglify())
        .pipe(gulp.dest(_dist));
});

/* Build the Angular templates */
gulp.task('templates', function() {
    return gulp.src(_src + "/templates/**/*.html")
        .pipe(minifyHTML({
            empty: true,
            quotes: true,
            spare: true
        }))
        .pipe(templateCache("app.templates.min.js", {
            module: "ht.templates",
            standalone: true
        }))
        .pipe(uglify())
        .pipe(gulp.dest(_dist + "/"));
});


gulp.task('mincss', function() {

    console.log("SOURCE", './public/css/*.css');

    // MAIN PAGE
    gulp.src([
        './public/vendor/bootstrap/bootstrap.css',
        './public/vendor/fontawesome/css/font-awesome.css',
        './public/vendor/owlcarousel/owl.carousel.min.css',
        './public/vendor/owlcarousel/owl.theme.default.min.css',
        './public/vendor/magnific-popup/magnific-popup.css',
        './public/css/theme.css',
        './public/css/theme-elements.css',
        './public/css/theme-blog.css',
        './public/css/theme-shop.css',
        './public/css/theme-animate.css',
        './public/vendor/rs-plugin/css/settings.css',
        './public/vendor/circle-flip-slideshow/css/component.css',
        './public/css/skins/default.css',
        './public/css/custom.css',
        './public/vendor/sweetalert/dist/sweetalert.css',
        './public/vendor/nouislider/jquery.nouislider.css'
    ]).pipe(minifyCSS({
        compatibility: 'ie8'
    }))
        .pipe(sourcemaps.write())
        .pipe(concat("min.css"))
        .pipe(gulp.dest(_dist));

    // ADMIN PAGE
    gulp.src([
        './public/vendor/bootstrap/bootstrap.css',
        './public/vendor/fontawesome/css/font-awesome.css',
        './public/vendor/magnific-popup/magnific-popup.css',
        './public/vendor/bootstrap-datepicker/css/datepicker3.css',
        './public/vendor/select2/select2.css',
        './public/vendor/jquery-datatables-bs3/assets/css/datatables.css',
        './public/vendor/jquery-ui/css/ui-lightness/jquery-ui-1.10.4.custom.css',
        './public/vendor/bootstrap-multiselect/bootstrap-multiselect.css',
        './public/vendor/morris/morris.css',
        './public/stylesheets/theme.css',
        './public/vendor/jqvmap/jqvmap.css',
        './public/stylesheets/skins/default.css',
        './public/stylesheets/theme-custom.css',
        './public/vendor/sweetalert/dist/sweetalert.css'
    ]).pipe(minifyCSS({
        compatibility: 'ie8'
    }))
        .pipe(sourcemaps.write())
        .pipe(concat("admin_min.css"))
        .pipe(gulp.dest(_dist));

});

/* watch the files changing */
gulp.task('watch', function() {
    gulp.watch(_src + "/templates/**/*.html", ['templates']);
    gulp.watch(_src + "/**/*.js", ['scripts']);
    gulp.watch("./public/css/*.css", ['mincss']);
    gulp.watch("./public/stylesheets/*.css", ['mincss']);
});

/* Build the whole app */
gulp.task('build', ['deps', 'scripts', 'templates', 'mincss']);

/* Task for development */
gulp.task('dev', function(cb) {
    runSequence('build', 'watch', cb);
});

/* Task for make a clean build */
gulp.task('default', function(cb) {
    runSequence('clean', 'build', cb);
});