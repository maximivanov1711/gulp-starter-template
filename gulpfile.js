"use strict";

const gulp = require("gulp");
const gulp_concat = require("gulp-concat");
const gulp_autoprefixer = require("gulp-autoprefixer");
const gulp_clean_css = require("gulp-clean-css");
const browser_sync = require("browser-sync").create();
const gulp_sass = require("gulp-sass");
const gulp_uglify = require("gulp-uglify-es").default;

gulp_sass.compiler = require("node-sass");

const css_files = ["./src/css/main.css", "./src/css/media.css"];

function scripts() {
  return gulp
    .src(["./src/js/main.js"])
    .pipe(gulp_uglify())
    .pipe(gulp.dest("build/js"))
    .pipe(browser_sync.stream());
}

function styles() {
  return gulp
    .src(css_files)
    .pipe(gulp_concat("style.css"))
    .pipe(
      gulp_autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(
      gulp_clean_css({
        level: 2,
      })
    )
    .pipe(gulp.dest("build/css"))
    .pipe(browser_sync.stream());
}

function sass() {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(gulp_sass().on("error", gulp_sass.logError))
    .pipe(gulp.dest("./src/css"));
}

function watch() {
  browser_sync.init({
    server: {
      baseDir: "./",
    },
  });
  gulp.watch("./src/js/**/*.js", scripts);
  gulp.watch("./src/css/**/*.css", styles);
  gulp.watch("./src/scss/**/*.scss", sass);
  gulp.watch("./*.html").on("change", browser_sync.reload);
}

gulp.task("watch", watch);
gulp.task("build", gulp.series(sass, styles, scripts));
gulp.task("default", gulp.series("build", "watch"));
