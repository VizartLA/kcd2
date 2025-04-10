const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('sass');
const gulpSass = require('gulp-sass')(sass);
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const include = require('gulp-include');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const svgSprite = require('gulp-svg-sprite'); 


function styles() {
  return src('app/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(gulpSass({ 
      outputStyle: 'compressed',
      includePaths: ['app/scss'],
      quietDeps: true
    }).on('error', gulpSass.logError))
    .pipe(autoprefixer({ 
      overrideBrowserslist: ['last 4 versions'],
      cascade: false
    }))
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}


function scripts() {
  return src([
    'node_modules/swiper/swiper-bundle.js',
    'app/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function images() {
  return src(['app/images/src/**/*.*', '!app/images/src/**/*.svg'])
    .pipe(newer('app/images'))
    .pipe(avif({ quality: 50 }))
    .pipe(dest('app/images'))
    .pipe(src('app/images/src/**/*.*'))
    .pipe(newer('app/images'))
    .pipe(webp())
    .pipe(dest('app/images'));
}

function sprite() {
  return src('app/images/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg',
          example: true
        }
      }
    }))
    .pipe(dest('app/images'));
}

function fonts() {
  return src('app/fonts/src/*.*')
    .pipe(fonter({ formats: ['woff', 'ttf'] }))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'));
}

function pages() {
  return src('app/pages/*.html')
    .pipe(include({ includePaths: 'app/components' }))
    .pipe(dest('app'))
    .pipe(browserSync.stream());
}

function cleanDist() {
  return src('dist', { allowEmpty: true }).pipe(clean());
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/images/*.*',
    '!app/images/*.svg',
    'app/images/sprite.svg',
    'app/fonts/*.*',
    'app/js/main.min.js',
    'app/**/*.html'
  ], { base: 'app' })
    .pipe(dest('dist'));
}

function watching() {
  browserSync.init({ server: { baseDir: "app/" } });
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/images/src'], images);
  watch(['app/js/**/*.js'], scripts);
  watch(['app/components/*', 'app/pages/*'], pages);
  watch(['app/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.pages = pages;
exports.sprite = sprite;
exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, images, fonts, pages, watching);