var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylus = require('gulp-stylus');
var nib = require('nib');

gulp.task('jshint', function() {
  return gulp.src(['./static/js/**/*.js'])
      .pipe(jshint({
          asi:true,
          laxbreak:true,
          expr:true
      }))
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'))
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