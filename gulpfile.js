'use strict'

const gulp = require('gulp')
const jade = require('gulp-jade')
const babel = require('gulp-babel')
const jekyll = require('gulp-jekyll')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const pump = require('pump')
const del = require('del')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const notify = require('gulp-notify')
const htmlminify = require('gulp-html-minifier')
const autoprefixer = require('gulp-autoprefixer')
const minifyCSS = require('gulp-minify-css')
const ghPages = require('gulp-gh-pages')
const imagemin = require('gulp-imagemin')
const gulpWebpack = require('gulp-webpack')
const webpack = require('webpack')
const browserSync = require('browser-sync').create()
const runSequence = require('gulp-run-sequence')

let source = {
  js: 'source/_js/**/*.js',
  sass: 'source/_sass/**/*.sass',
  html: 'source/**/*.html',
  img: 'source/assets/img/',
  jade: 'source/_jade/**/*.jade',
  output: {
    js: 'source/assets/js/',
    css: 'source/assets/css/',
    html: 'source/'
  }
}

let live = {
  css: '_live/assets/css/',
  js: '_live/assets/js/',
  img: '_live/assets/img/',
  html: '_live/**/*.html',
  all: '_live/*'
}

let build = {
  dest: 'build/',
  js: 'build/assets/js/',
  css: 'build/assets/css/',
  img: 'build/assets/img/'
}

//========== Remove Old Build ===========//
gulp.task('clean:build', () => {
  return del(build.dest)
})

//========== Remove Old Jade Build ==========//
gulp.task('jade:clean', () => {
  return del(source.html)
})

//========== Remove live Build ==========//
gulp.task('live:clean', ['jade:clean'], () => {
  return del(live.all)
})

//========== Jade Build =========//
gulp.task('jade:build', () => {
  return gulp.src(source.jade)
  	.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(jade())
    .pipe(gulp.dest(source.output.html))
})

//========== Web Pack Build ==========//
gulp.task('Webpack:build', () => {
  return gulp.src('source/_js/main.js')
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(gulpWebpack({ output: { filename: 'main.js' } }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(source.output.js))
})

//========== Sass Build ==========//
gulp.task('sass:build', () => {
  return gulp.src(source.sass)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sass({ indentedSyntax: true }))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest(source.output.css))
})

//========= Jekyll Build ==========//
gulp.task('jekyll:build', () => {
  return gulp.src(process.cwd())
  	.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(jekyll({
      bundleExec: false,
      quiet: true,
      safe: true,
      layouts: '_layouts',
      plugins: '_plugins',
      source: './source/',
      destination: '_live'
    }))
})

//========== Html Build =========//
gulp.task('html:build', () => {
  return gulp.src(live.html)
    .pipe(htmlminify({ collapseWhitespace: true }))
    .pipe(gulp.dest(build.dest))
})

//========== js Build ==========//
gulp.task('js:build', () => {
  gulp.src(live.js + 'main.js')
    .pipe(gulpWebpack({
      output: {
        filename: 'main.js'
      },
      plugins: [new webpack.optimize.UglifyJsPlugin()]
    }, webpack))
    .pipe(gulp.dest(build.js))
})

//========== css Build ==========//
gulp.task('css:build', () => {
  return gulp.src(live.css + '**/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest(build.css))
})

//========= Img Build ==========//
gulp.task('img:build', () => {
  return gulp.src(source.img + '**/*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: false,
      svgoPlugins: [{
        removeViewBox: false
      }]
    }))
    .pipe(gulp.dest(build.img))
})

//========= Copy Build ==========//
gulp.task('copy:build', () => {
  return gulp.src(live.all + '.{txt,xml,ico,png}')
    .pipe(gulp.dest(build.dest))
})

//========== Run Build ==========//
gulp.task('build', (cb) => {
  runSequence(
    'clean:build',
    'live:clean',
    'jade:build',
    'Webpack:build',
    'sass:build',
    'jekyll:build',
    'html:build',
    'js:build',
    'css:build',
    'img:build',
    'copy:build',
    cb)
})

//========== Run Server ==========//
gulp.task('serve', () => {
  browserSync.init({
    server: './_live',
    reloadDelay: 2000
  })
  gulp.watch(source.sass, ['sass:build', 'jekyll:build'])
  gulp.watch(source.jade, ['jade:build'])
  gulp.watch(source.html, ['jekyll:build'])
  gulp.watch(source.js, ['Webpack:build', 'jekyll:build'])
  gulp.watch('_live/*.html').on('change', browserSync.reload)
})

//========== Run Deploy ========//
gulp.task('deploy', ['build'], () => {
  return gulp.src('./build/**/*')
    .pipe(ghPages())
})
