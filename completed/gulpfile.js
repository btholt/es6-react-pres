var gulp = require('gulp');
var browserify = require('browserify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
 
// Basic usage 
gulp.task('scripts', function() {
 var entryFile = './jsx/clientApp.jsx';

  var bundler = browserify({
    extensions: ['.js', '.es6.js', '.jsx'],
    transform: ['babelify']
  });

  bundler.add(entryFile);

  var stream = bundler.bundle();
  stream.on('error', function (err) { console.error(err.toString()) });

  stream
    .pipe(source(entryFile))
    .pipe(rename('index.js'))
    .pipe(gulp.dest('public/'));
});

gulp.task('watch', function() {
  gulp.watch(['./jsx/**/*'], ['scripts']);
});
