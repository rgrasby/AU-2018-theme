var gulp = require('gulp');
var watch = require('gulp-watch');
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
    return gulp.src(['./js-dev/mainsite/listings/cp-listings-plugins.js', './js-dev/mainsite/listings/cp-listings.js', './js-dev/mainsite/listings/favorites.js'])
    .pipe(concat('cp-listings.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});

gulp.task('mainsite', function() {
    return gulp.src(['./js-dev/vendor/jquery-ui.min.js', './js-dev/vendor/dropdown.js', './js-dev/vendor/jquery.waypoints.min.js', './js-dev/global-plugins.js', './js-dev/mainsite/mainsite-plugins.js', './js-dev/global-main.js', './js-dev/navigation.js', './js-dev/mainsite/mainsite-main.js', './js-dev/mainsite/askau.js'])
    .pipe(concat('mainsite.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});

gulp.task('subsites', function() {
    return gulp.src(['./js-dev/vendor/jquery-ui.min.js', './js-dev/vendor/dropdown.js', './js-dev/global-plugins.js', './js-dev/global-main.js', './js-dev/navigation.js', './js-dev/subsites/subsite-plugins.js', './js-dev/subsites/subsite-main.js'])
    .pipe(concat('subsite.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});

//Watch task
gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['sass'])
});

gulp.task('default', ['sass', 'listings', 'mainsite', 'subsites', 'watch']);

 