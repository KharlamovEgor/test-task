import { watch, src, dest, parallel, series } from 'gulp';
import { create } from 'browser-sync';
import autoPrefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import GulpCleanCss from 'gulp-clean-css';

const browserSunc = create();

function liveReload() {
  browserSunc.init({
    server: {
      baseDir: 'src/',
    },
  });
}

function styles() {
  return src('src/styles/**/*.css', {
    ignore: ['src/styles/styles.min.css'],
  })
    .pipe(concat('styles.min.css'))
    .pipe(autoPrefixer({}))
    .pipe(GulpCleanCss())
    .pipe(dest('src/styles/'))
    .pipe(browserSunc.stream());
}

function startWatch() {
  watch(['./src/**/*.css', '!./src/styles/styles.min.css'], styles);
  watch('./src/index.html').on('change', browserSunc.reload);
}

function build() {
  return src(['src/styles/*.min.css', 'src/images/*', 'src/index.html'], {
    base: 'src',
  }).pipe(dest('dist'));
}

exports.default = parallel(styles, liveReload, startWatch);
exports.reload = liveReload;
exports.build = series(styles, build);
