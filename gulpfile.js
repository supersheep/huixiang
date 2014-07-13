var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylus = require('gulp-stylus');
var nib = require('nib');
var map = require('map-stream');

var errorReporter = function () {
  return map(function (file, cb) {
    if (!file.jshint.success) {
      process.exit(1);
    }
    cb(null, file);
  });
};

gulp.task('jshint', function() {
  return gulp.src(['./static/js/**/*.js'])
      .pipe(jshint({
          asi:true,
          laxbreak:true,
          expr:true
      }))
      .pipe(jshint.reporter('default'))
      .pipe(errorReporter());
});

gulp.task('stylus', function() {
  return gulp.src(['./static/stylus/**/*.styl'])
    .pipe(stylus({
      use: [nib()],
      'import': ['nib']
    }))
    .on('error', console.log)
    .pipe(gulp.dest('./static/css/'));
});

gulp.task('watch', function() {
  gulp.watch(["./static/stylus/**/*.styl"], ['stylus']);
});

gulp.task('default', ['jshint','stylus']);