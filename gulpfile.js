import gulp from 'gulp';
const {src, dest, series, parallel, watch} = gulp;
import gulpSass from 'gulp-sass' ;
import * as dartSass from 'sass'; // Sass dosyalarını CSS'e derler.
const sass = gulpSass(dartSass);
import cleancss from 'gulp-clean-css'; // CSS dosyalarını sıkıştırır.
import autoprefixer from 'gulp-autoprefixer'; // CSS uyumluluk ayarları ekleyici.
// import purgecss from 'gulp-purgecss'; // gereksiz CSS temizler.
import pug from 'gulp-pug'; // PUG dosyasını HTML 2e dönüştürür.
import ts from 'gulp-typescript'; // TS dosyasını JS ye dönüştürür.
import terser from 'gulp-terser'; // JS dosyasını sıkıştırır.
import imagemin from 'gulp-imagemin'; // resim sıkıştırır.
import imagewebp from 'gulp-webp'; // görselleri WEBP'ye dönüştürür.
import rename from 'gulp-rename'; // dosya adını değiştirir.
import sourcemaps from 'gulp-sourcemaps';  // hatanın asıl yerini gösterir.

const tsProject = ts.createProject('tsconfig.json');

function htmlTask(){
	return src('src/pages/*.pug')
		.pipe(pug({pretty: true}))
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

export { htmlTask, cssTask, scriptsTask, imgTask };
export default series(parallel(htmlTask, cssTask, scriptsTask, imgTask), watchTask);