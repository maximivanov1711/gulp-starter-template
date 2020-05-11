"use strict";

const gulp = require("gulp");
const gulp_concat = require("gulp-concat");
const gulp_autoprefixer = require("gulp-autoprefixer");
const gulp_clean_css = require("gulp-clean-css");
const browser_sync = require("browser-sync").create();
const gulp_sass = require("gulp-sass");
const gulp_uglify = require("gulp-uglify-es").default;

gulp_sass.compiler = require("node-sass");

const css_files = ["./app/src/css/main.css", "./app/src/css/media.css"];

function scripts() {
  return gulp
    .src(["./app/src/js/main.js"])
    .pipe(gulp_uglify({ toplevel: true }))
    .pipe(gulp.dest("./app/built/js"))
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
    .pipe(gulp.dest("./app/built/css"))
    .pipe(browser_sync.stream());
}

function sass() {
  return gulp
    .src("./app/src/scss/**/*.scss")
    .pipe(gulp_sass().on("error", gulp_sass.logError))
    .pipe(gulp.dest("./app/src/css"));
}

function watch() {
  browser_sync.init({
    server: {
      baseDir: "./app/",
    },
  });
  gulp.watch("./app/src/js/**/*.js", scripts);
  gulp.watch("./app/src/css/**/*.css", styles);
  gulp.watch("./app/src/scss/**/*.scss", sass);
  gulp.watch("./app/*.html").on("change", browser_sync.reload);
}

gulp.task("watch", watch);
gulp.task("build", gulp.series(sass, styles, scripts));
gulp.task("default", gulp.series("build", "watch"));
