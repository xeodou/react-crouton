'use strict';

var gulp = require('gulp')
  , browserify = require('gulp-browserify')
  , $ = require('gulp-load-plugins')()    // Load plugins
  , path = require('path')
  , sass = require('gulp-sass')
  , deploy = require("gulp-gh-pages")
  , pkg = require('../package.json');

var root = path.resolve(__dirname)

// Sass
gulp.task('sass', function() {
  return gulp.src(root + '/style.scss')
    .pipe(sass({
        includePaths: require('eggshell').includePaths
    }))
    .pipe(gulp.dest(root + '/build'))
    .pipe($.size());
});

// index.html
gulp.task('index', function(){
  return gulp.src(root + '/index.html')
  .pipe(gulp.dest(root + '/build'))
  .pipe($.size())
})

// Reactjs jsx file
gulp.task('browserify', function() {
  return gulp.src('app.js')
    .pipe(browserify({
      insertGlobals : false,
      transform: ['reactify'],
      extensions: ['.js']
    })).on('error', function(e) {
      console.log(e)
      this.emit('end');
    }).pipe(gulp.dest(root + '/build/'))
    .pipe($.size());
});

// Clean
gulp.task('clean', function() {
  return gulp.src([root + '/build/*'], {
      read: false
    })
    .pipe($.rimraf());
});

// Watch
gulp.task('watch', function() {
  // Wathch .scss files
  gulp.watch('style.scss', ['sass']);
  // Watch .jsx files
  gulp.watch('app.js', ['browserify']);

})

gulp.task('deploy', function () {
    gulp.src(root + '/build/**/*')
        .pipe(deploy({
          remoteUrl: pkg.repository.url
        }));
});

gulp.task('build', [ 'clean', 'index', 'sass', 'browserify']);

gulp.task('default', ['build']);
