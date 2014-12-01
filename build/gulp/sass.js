var gulp = require('gulp');
var sass = require('gulp-sass');
var path = require('path');

function gulp_sass () {
  gulp.src('./web/src/scss/index.scss')
    .pipe(sass({ style: 'expanded' }))
    // .pipe(gulp.dest('build/css'))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(minifycss())
    .pipe(gulp.dest('./web/dist/css'));
}

module.exports = gulp_sass;
