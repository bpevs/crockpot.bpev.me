var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');

gulp.task('jshint', function() {
  return gulp.src('app/*.js')
    .pipe(jshint());
});

gulp.task('mocha', function() {
  return gulp.src('./test/*.js')
    .pipe(mocha());
});

gulp.task('nodemon', ['test'], function () {
  nodemon({
    script: 'app/server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('test', ['jshint', 'mocha']);
gulp.task('default', ['test', 'nodemon']);
