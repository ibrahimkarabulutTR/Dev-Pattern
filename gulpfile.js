import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import cleanCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import pug from 'gulp-pug';
import typescript from 'gulp-typescript';
import terser from 'gulp-terser';
import gulpIf from 'gulp-if';
import sharpOptimizeImages from 'gulp-sharp-optimize-images';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import notify from 'gulp-notify';

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
	scaleImg: {
		src: 'src/scale-images/*',
		dest: 'src/images'
	},
	compareImg: {
		src: 'src/images/*.jpg',
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

const html = () => {
	return src(path.html.src)
		.pipe(plumber())
		// .pipe(plumber({ errorHandler: onError })) // bildirim almak için aç
		.pipe(pug({
				pretty: true
			})
		)
		.pipe(dest(path.html.dest))
}

const css = () => {
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

const js = () => {
	return src(path.js.src)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		// .pipe(plumber({ errorHandler: onError })) // bildirim almak için aç
		.pipe(tsproject())
		.pipe(terser())
		.pipe(sourcemaps.write(''))
		.pipe(dest(path.js.dest))
}

const compareImg = () => {
  return src('src/images/*.{jpg,jpeg,png}')
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
    .pipe(dest('dist/assets/img/'))
    .pipe(sharpOptimizeImages({
      webp: { quality: 70 }
    }))
    .pipe(dest('dist/assets/img/'));
};

const watchFiles = () => {
	gulpWatch(path.html.src, html);
	gulpWatch(path.css.src, css);
	gulpWatch(path.js.src, js);
	gulpWatch(path.compareImg.src, compareImg);
}

export default series(
	parallel(html, css, js, compareImg),
	watchFiles
)