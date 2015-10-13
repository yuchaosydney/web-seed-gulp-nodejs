var
  gulp           = require('gulp'),
  plumber        = require('gulp-plumber'),
  prefixer       = require('gulp-autoprefixer'),
  coffee         = require('gulp-coffee'),
  sass           = require('gulp-sass'),
  gutil          = require('gulp-util'),
  minify         = require('gulp-minify-css'),
  uglify         = require('gulp-uglify'),
  concat         = require('gulp-concat'),
  imagemin       = require('gulp-imagemin'),
  pngquant       = require('imagemin-pngquant'),
  jpegtran       = require('imagemin-jpegtran'),
  notify         = require('gulp-notify');

// WATCH
gulp.task('watch', watch);

// Compile sass files and move them to dist/styles
gulp.task('sass', compileSass);

// Compile coffee files and move them to dist/scripts
gulp.task('coffee', compileCoffee);

gulp.task('js', compileJs);

// Crush images and move them to dist/images
gulp.task('crushImages', crushImages);
gulp.task('compileTemplates', compileTemplates);
gulp.task('moveFonts', moveFonts);


gulp.task('build', ['sass', 'coffee', 'js', 'crushImages', 'compileTemplates', 'moveFonts']);

gulp.task('default', ['watch']);

function watch() {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/scripts/**/*.coffee', ['coffee']);
  gulp.watch('src/scripts/**/*.js', ['js']);
  gulp.watch('src/images/*', ['crushImages']);
  gulp.watch('src/**/*.php', ['compileTemplates']);
}

function compileJs() {
  return gulp.src('src/scripts/**/*.js')
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(gulp.dest('dist/scripts'));
}

function compileCoffee() {
  return gulp.src('src/scripts/**/*.coffee')
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(coffee({ bare: true }).on('error', gutil.log))
             .pipe(gulp.dest('dist/scripts'));
}

function compileSass() {
  return gulp.src('src/scss/main.scss')
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(sass())
             .pipe(minify({keepSpecialComments: '1'}))
             .pipe(prefixer('last 2 version'))
             .pipe(gulp.dest('dist/styles'));
}

function compileTemplates() {
  return gulp.src('src/**/*.php')
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(gulp.dest('dist/'));
}

function moveFonts() {
  return gulp.src('src/fonts/*')
    .pipe(plumber({errorHandler: notify.onError("Err: <%= error.message %>")}))
    .pipe(gulp.dest('dist/fonts'));
}



function crushImages() {
  return gulp.src('src/images/*')
      .pipe(imagemin({
        progressive : true,
        use : [
          pngquant({ quality: '65-80', speed: 4 }),
          jpegtran({ progressive: true })
        ]
      }))
      .pipe(gulp.dest('dist/images/'));
}
