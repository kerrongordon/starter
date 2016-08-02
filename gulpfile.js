'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const jekyll = require('gulp-jekyll');
const sass   = require('gulp-sass');
const uglify = require('gulp-uglify');
const pump = require('pump');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const notify = require("gulp-notify");
const htmlminify = require("gulp-html-minify");
const autoprefixer = require('gulp-autoprefixer');
const minifyCSS = require('gulp-minify-css');
const ghPages = require('gulp-gh-pages');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();


let source = {
	js: 'source/_js/**/*.js',
	sass: 'source/_sass/**/*.sass',
	html: 'source/**/*.html',
	img: 'source/assets/img/',
	output: {
		js: 'source/assets/js/',
		css: 'source/assets/css/'
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

//==========================================================//
//=====================Clean Build==========================//
//==========================================================//

gulp.task('clean:build', () => {
	return del(build.dest)
});


//==========================================================//
//========================CONCAT============================//
//==========================================================//

gulp.task('concat', ['clean:build'], () => {
  return gulp.src(source.js)
  	.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(source.output.js));
});

//==========================================================//
//=========================SASS=============================//
//==========================================================//

gulp.task('sass', ['concat'], () => {
	return gulp.src(source.sass)
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		// .pipe(sourcemaps.init())
		.pipe(sass({ indentedSyntax: true }))
		// .pipe(sourcemaps.write())
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    	.pipe(gulp.dest(source.output.css))
    	.pipe(browserSync.stream());
});

//==========================================================//
//=======================Jekyll=============================//
//==========================================================//

gulp.task('jekyll', ['sass'], () => {
	return gulp.src(process.cwd())
		.pipe(jekyll({
			bundleExec: false,
			quiet: true,
			safe: true,
			layouts: '_layouts',
      		plugins: '_plugins',
      		source: './source/',
      		destination: '_live'
		}))
});

//==========================================================//
//=====================Html Build===========================//
//==========================================================//

gulp.task('html:build', ['jekyll'], () => {
	return gulp.src(live.html)
		.pipe(htmlminify())
		.pipe(gulp.dest(build.dest));
});

//==========================================================//
//=======================Js Build===========================//
//==========================================================//

gulp.task('js:build', ['html:build'], (cb) => {
  pump([gulp.src('_live/assets/js/main.js'), uglify(), gulp.dest(build.js)], cb);
});

//==========================================================//
//======================Css Build===========================//
//==========================================================//

gulp.task('css:build', ['js:build'], () => {
	return gulp.src(live.css + '**/*.css')
		.pipe(minifyCSS())
    	.pipe(gulp.dest(build.css));
});

//==========================================================//
//========================Img Build=========================//
//==========================================================//

gulp.task('img:build', ['css:build'], () => {
    return gulp.src(source.img + '**/*')
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: false,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(gulp.dest(build.img));
});

//==========================================================//
//=========================Build============================//
//==========================================================//

gulp.task('build', ['img:build'], () => {
	return gulp.src(live.all + '.{txt,xml,ico,png}')
		.pipe(gulp.dest(build.dest));
});

//==========================================================//
//=====================Gulp Serve===========================//
//==========================================================//

gulp.task('serve', ['jekyll', 'sass', 'concat'], () => {

    browserSync.init({
        server: "./_live"
    });

    gulp.watch(source.sass, ['sass', 'jekyll']);
    gulp.watch(source.html, ['jekyll']);
    gulp.watch(source.js, ['concat', 'jekyll']);
    gulp.watch(live.html).on('change', browserSync.reload);
});

//==========================================================//
//=====================Gulp deploy===========================//
//==========================================================//

gulp.task('deploy', ['build'], () => {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});
