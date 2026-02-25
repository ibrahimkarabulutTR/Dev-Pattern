import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import cleanCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import pug from 'gulp-pug';
import phug from 'gulp-phug';
import typescript from 'gulp-typescript';
import terser from 'gulp-terser';
import gulpIf from 'gulp-if';
import sharpOptimizeImages from 'gulp-sharp-optimize-images';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import notify from 'gulp-notify';
import phplint from 'gulp-phplint';

const {src, dest, series, parallel, watch: gulpWatch} = gulp;
const sass = gulpSass(dartSass);
const tsproject = typescript.createProject('tsconfig.json');
const path = {
	html: {
		src: 'src/pages/*',
		dest: 'dist/'
	},
	css: {
		src: 'src/styles/*',
		dest: 'dist/assets/css/'
	},
	js: {
		src: 'src/scripts/*',
		dest: 'dist/assets/js'
	},
	php: {
		src: 'src/pages/**/*.pug',
		dest: 'dist/'
	},
	compareImg: {
		src: 'src/images/',
		dest: 'dist/assets/img'
	}
}

const onError = function(err) {
	notify.onError({
		title: 'Gulp Hatası: ('+err.plugin+')',
		message: 'Hata: <%= error.message %>',
		sound: 'Beep',
		timeout:  3,
		wait: false
	})(err)
	this.emit('end')
}

export const html = () => {
	return src(path.html.src)
		.pipe(plumber())
		// .pipe(plumber({ errorHandler: onError })) // bildirim almak için aç
		.pipe(pug({
				pretty: true
			})
		)
		.pipe(dest(path.html.dest))
}

export const css = () => {
	return src(path.css.src)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		// .pipe(plumber({ errorHandler: onError })) // bildirim almak için aç
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cleanCss())
		.pipe(sourcemaps.write(''))
		.pipe(dest(path.css.dest))
}

export const js = () => {
	return src(path.js.src)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		// .pipe(plumber({ errorHandler: onError })) // bildirim almak için aç
		.pipe(tsproject())
		.pipe(terser())
		.pipe(sourcemaps.write(''))
		.pipe(dest(path.js.dest))
}

export const php = () => {
	return src(path.php.src)
		.pipe(phug({
			php: true,
			doubleQuote: true
		}))
		.pipe(dest(path.php.src))
}

export const compareImg = () => {
  return src(path.compareImg.src+'*.{jpg,jpeg,png}')
    .pipe(gulpIf(file => file.extname === '.jpg' || file.extname === '.jpeg', 
      sharpOptimizeImages({
        jpg: { quality: 70, mozjpeg: true }
      })
    ))
    .pipe(gulpIf(file => file.extname === '.png', 
      sharpOptimizeImages({
        png: { quality: 50, palette: true }
      })
    ))
    .pipe(dest(path.compareImg.dest))
    .pipe(sharpOptimizeImages({
      webp: { quality: 70 }
    }))
    .pipe(dest(path.compareImg.dest));
};

export const phpTest = () => {
	return gulp.src('dist/**/*.php')
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(phplint())
		.pipe(phplint.reporter('fail'))
		// .pipe(sourcemaps.write(''))
}

// backend için html yerin php yaz
export const watchFiles = () => {
	gulpWatch(path.html.src, html);
	gulpWatch(path.css.src, css);
	gulpWatch(path.js.src, js);
	gulpWatch(path.compareImg.src, compareImg);
}

export const build = series(
	parallel(html, css, js, compareImg)
)

export default series(
	parallel(html, css, js, compareImg),
	watchFiles
)