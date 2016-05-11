var gulp = require('gulp'),
  del = require('del'),
  sass = require('gulp-sass'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream');

var paths = {
  packages: [{
    src: 'node_modules/bootstrap/dist/**/*',
    dest: 'bootstrap'
  }, {
    src: 'node_modules/font-awesome/css/**/*',
    dest: 'font-awesome/css'
  }, {
    src: 'node_modules/font-awesome/fonts/**/*',
    dest: 'font-awesome/fonts'
  }, {
    src: 'node_modules/jquery/dist/**/*',
    dest: 'jquery'
  }, {
    src: 'node_modules/dragula/dist/**/*',
    dest: 'dragula'
  }, {
    src: 'node_modules/firebase/lib/**/*',
    dest: 'firebase'
  }, {
    src: 'node_modules/piklor.js/src/**/*',
    dest: 'piklor'
  },
  {
    src: 'node_modules/vue/dist/**/*',
    dest: 'vue'
  },
  {
    src: 'node_modules/underscore/**/*',
    dest: 'underscore'
  }],
  output: 'static/'
};

gulp.task('copy', function() {
  for (var i = 0; i < paths.packages.length; i++) {
    var package = paths.packages[i];
    gulp.src(package.src)
      .pipe(gulp.dest(paths.output + package.dest));
  }
});

gulp.task('bundle', function() {
  browserify('./app/app.js')
    .bundle()
    .pipe(source('app-built.js'))
    .pipe(gulp.dest('./app'));
});

gulp.task('bundle:watch', function() {
  gulp.watch('app/*.js', ['bundle']);
});

gulp.task('sass', function() {
  gulp.src('static/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('static'));
});

gulp.task('sass:watch', function() {
  gulp.watch('static/*.scss', ['sass']);
});

gulp.task('clean', function() {
  del('node_modules');
  for (var i = 0; i < paths.packages.length; i++) {
    var package = paths.packages[i];
    del([paths.output + package.dest]);
  }
});

gulp.task('watch', ['sass:watch', 'bundle:watch']);

gulp.task('default', ['copy', 'sass', 'bundle']);
