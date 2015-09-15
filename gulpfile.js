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
    .pipe(mocha())
    .once('error', process.exit.bind(null, 1))
    .once('end', process.exit.bind(null, 1));
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'app/server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('test', ['jshint', 'mocha']);
gulp.task('default', ['nodemon']);
