var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass');

var paths = {
    packages: [
        { src: 'node_modules/bootstrap/dist/**/*', dest: 'bootstrap' },
        { src: 'node_modules/font-awesome/css/**/*', dest: 'font-awesome/css' },
        { src: 'node_modules/font-awesome/fonts/**/*', dest: 'font-awesome/fonts' }],
    output: 'css/'
};

gulp.task('copy', function () {
    for(var i = 0; i < paths.packages.length; i++) {
        var package = paths.packages[i];
        gulp.src(package.src)
            .pipe(gulp.dest(paths.output + package.dest));
    }
});

gulp.task('sass', function () {
    gulp.src('static/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./static'));
});

gulp.task('sass:watch', function () {
    gulp.watch('static/*.scss', ['sass']);
});

gulp.task('clean', function () {
    for(var i = 0; i < paths.packages.length; i++) {
        var package = paths.packages[i];
        del([paths.output + package.dest]);
    }
});

gulp.task('default', function() {
    gulp.start('copy', 'sass');
});
