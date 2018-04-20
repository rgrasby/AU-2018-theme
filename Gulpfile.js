var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('sass', function() {
    gulp.src('sass/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
		.pipe(autoprefixer({browsers: ['last 2 versions', 'ie >= 9', "Android >= 5", "Safari >= 6"]}))
		.pipe(gulp.dest('./css'))
}); 

gulp.task('listings', function() {
    return gulp.src(['./js/mainsite/listings/cp-listings-plugins.js', './js/mainsite/listings/cp-listings.js'])
    .pipe(concat('cp-listings.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('mainsite', function() {
    return gulp.src(['./js/vendor/jquery.waypoints.min.js', './js/global-plugins.js', './js/mainsite/mainsite-plugins.js', './js/global-main.js', './js/navigation.js', './js/mainsite/mainsite-main.js'])
    .pipe(concat('mainsite.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('subsites', function() {
    return gulp.src(['./js/vendor/jquery-ui.min.js', './js/global-plugins.js', './js/global-main.js', './js/navigation.js', './js/subsites/subsite-plugins.js', './js/subsites/subsite-main.js'])
    .pipe(concat('subsite.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

//Watch task
gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['sass'])
});

gulp.task('default', ['sass', 'listings', 'mainsite', 'subsites', 'watch']);

