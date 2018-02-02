var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function() {
    gulp.src('sass/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
		.pipe(autoprefixer({browsers: ['last 2 versions', 'ie >= 9', "Android >= 5", "Safari >= 6"]}))
		.pipe(gulp.dest('./css'))
}); 



//Watch task
gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['sass'])
});

gulp.task('default', ['sass', 'watch']);