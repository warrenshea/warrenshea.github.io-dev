'use strict';

const gulp = require('gulp'),

      //CSS
      sass = require('gulp-dart-sass'),
      postcss = require('gulp-postcss'),
      cleanCSS = require('gulp-clean-css'),

      //JavaScript
      babel = require('gulp-babel'),
      uglify = require('gulp-uglify'),

      //Helpers
      harp = require('harp'),
      exec = require('child_process').exec,
      autoprefixer = require('autoprefixer'),
      //autoprefixer = require('gulp-autoprefixer'),
      browserSync = require('browser-sync'),
      reload = browserSync.reload,
      argv = require('yargs').argv,
      del = require('del');

const browserSyncReload = (done) => {
  reload();
}

const clean = (done) => {
  if (process.env.NODE_ENV === 'production') {
    return del([
      '_dist/*',
      '_dist/**/*'
    ]);
  } else {
    done();
  }
}

const css = (done) => {
  let plugins = [
      autoprefixer({browserlist: ['last 2 version','ie 11']})
  ];
  if (process.env.NODE_ENV === 'development') {
    return gulp.src(['./_dev/stylesheets/**/*.scss'])
      .pipe(sass().on('error', sass.logError))
      //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
      /*.pipe(cleanCSS({
        //Remove comments and minify
        level: {
          1: {specialComments: 0}
        }}))*/
      .pipe(gulp.dest('./_dev/stylesheets'))
      .pipe(reload({stream: true}));
  } else {
    return gulp.src(['./_dev/stylesheets/**/*.scss'])
      .pipe(sass().on('error', sass.logError))
      //.pipe(postcss(plugins))
      /*.pipe(autoprefixer('last 2 version', 'IE 11'))
      .pipe(cleanCSS({
        //Remove comments and minify
        level: {
          1: {specialComments: 0}
        }}))*/
      .pipe(gulp.dest('./_dist/stylesheets'));
  }
}

const clean_notes = (done) => {
  if (process.env.NODE_ENV === 'production') {
    return del([
      '_dist/notes*'
    ]);
  } else {
    done();
  }
}

const js = (done) => {
  if (process.env.NODE_ENV === 'development') {
    return gulp.src(['./_dev/scripts/**/*.js'])
      .pipe(reload({stream: true}));
  } else {
    return gulp.src(['./_dev/scripts/**/*.js'])
      .pipe(babel({"presets": ['@babel/preset-env']}))
      // .pipe(uglify()) //Minify
      .pipe(gulp.dest('./_dist/scripts'));
  }
}

const images = () => {
  return gulp.src('./_dev/assets/images/**/*')
    .pipe(gulp.dest('./_dist/assets/images/'))
    .on('error', function(e){console.log("ERROR 2",e);});
}

const html = (done) => {
  if (process.env.NODE_ENV === 'development') {
    browserSyncReload();
  }
  done();
}

const watchFiles = () => {
  gulp.watch(['./_dev/stylesheets/*.scss', './_dev/stylesheets/**/*.scss','./_dev/style-guide/**/*.css'], css);
  gulp.watch(['./_dev/scripts/*.js', './_dev/scripts/**/*.js',,'./_dev/style-guide/**/*.js'], js);
  gulp.watch('./_dev/**/*.ejs', html);
}

const devSetEnv = (done) => {
  process.env.NODE_ENV = 'development';
  console.log("Environment: ",process.env.NODE_ENV);
  done();
}

const prodSetEnv = (done) => {
  process.env.NODE_ENV = 'production';
  console.log("Environment: ",process.env.NODE_ENV);
  done();
}

const serve = (done) => {
  harp.server(__dirname + "/_dev", {
    port: 9100
  }, function (done){
    browserSync({
      proxy: "localhost:9100",
      open: true,
      startPath: '/'
    });
  });
  done();
}

const build = (done) => {
  exec('npm run compile', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    css();
    js();
    clean_notes();
    console.log("Build completed!");
  });
  done();
}

/* This won't work, build will override css and js. Moved CSS and JS to Callback of Build
This is unique to HarpJS and how the folder code is structured*/
//const defaultProd = gulp.series(prodSetEnv, clean, build, css, js);
const defaultProd = gulp.series(prodSetEnv, clean, build);

const defaultDev = gulp.series(devSetEnv, gulp.parallel(serve, css, js, html, watchFiles));

exports.default = (argv.prod === true) ? defaultProd : defaultDev;