const {src, dest, series, parallel, watch} = require('gulp');

const sass = require('gulp-sass')(require('sass')); // Sass dosyalarını CSS'e derler.
const cleancss = require('gulp-clean-css'); // CSS dosyalarını sıkıştırır.
const autoprefixer = require('gulp-autoprefixer'); // CSS uyumluluk ayarları ekleyici.
const purgecss = require('gulp-purgecss'); // gereksiz CSS temizler.
const pug = require('gulp-pug'); // PUG dosyasını HTML 2e dönüştürür.
const ts = require('gulp-typescript'); // TS dosyasını JS ye dönüştürür.
const terser = require('gulp-terser'); // JS dosyasını sıkıştırır.
const imagemin = require('gulp-imagemin'); // resim sıkıştırır.
const imagewebp = require('gulp-webp'); // görselleri WEBP'ye dönüştürür.
const rename = require('gulp-rename'); // dosya adını değiştirir.
const sourcemaps = require('gulp-sourcemaps');  // hatanın asıl yerini gösterir.

function htmlTask(){
	return src('src/pages/*.pug')
		.pipe(sourcemaps.init())
		.pipe(pug({pretty: true}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('dist/'));
}

function cssTask() {
	return src('src/styles/**/*.sass')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(cleancss())
		.pipe(autoprefixer())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('dist/assets/css'));
}

const tsProject = ts.createProject('tsconfig.json');

function scriptsTask(){
	return src('src/scripts/*.ts')
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.pipe(terser())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('dist/assets/js'));
}

function imgTask(){
	return src('src/images/*')
		.pipe(imagewebp())
		.pipe(imagemin())
		.pipe(dest('dist/assets/img'));
}

function watchTask(){
	watch('src/pages/**/*.pug', htmlTask);
	watch('src/styles/**/*.sass', cssTask);
	watch('src/scripts/**/*.ts', scriptsTask);
	watch('src/images/**/*', imgTask);
}

exports.default = series(parallel(htmlTask, cssTask, scriptsTask, imgTask), watchTask);