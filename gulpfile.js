const gulp = require("gulp");
const browserSync = require("browser-sync").create();

const pug = require("gulp-pug");
const prefixer = require("gulp-autoprefixer");
const gulp_concat = require("gulp-concat");
const gulp_uglify = require("gulp-uglify");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require("gulp-sourcemaps")

function html(){
    return gulp.src("./index.pug")
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('./'))
}

function css(){
    return gulp.src("./scss/index.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({}))
    .pipe(prefixer())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream())
}


function js(){
    return gulp.src("./index.js")
           .pipe(gulp.dest("./"))
}

function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    })

    gulp.watch("./scss/**.scss", css)
    gulp.watch("./index.pug", html)
    gulp.watch("./pug/**.pug", html)
    gulp.watch("./js/**.js", js)
    gulp.watch("./index.html").on("change", browserSync.reload)
    gulp.watch("./index.js").on("change", browserSync.reload)

}


// function exports
exports.css = css;
exports.html = html;
exports.js = js;
exports.watch = watch;