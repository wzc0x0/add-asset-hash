var gulp = require('gulp'),
    browserSync = require('browser-sync').create(), // 静态服务器
    watch = require('gulp-watch'),
    clean = require('gulp-clean'),
    assetRev = require('gulp-asset-time'),
    cssmin = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin'),
    jsmin = require('gulp-uglify'),
    zip = require('gulp-zip'),
    options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };

//清空dist目录
gulp.task('clear-dist-dir', function() {
    return gulp.src(['./dist'])
        .pipe(clean());
});

//拷贝项目所有源文件到dist目录下，并排除node_modules, gulpfile.js, package.json, README.md这些目录和文件
gulp.task('copy-file-to-dist', ['clear-dist-dir'], function() {
    return gulp.src(['./**/*.*', '!./node_modules/**/*.*', '!./gulpfile.js', '!./*.json', '!./yarn.lock', '!./README.md'])
        .pipe(gulp.dest('./dist'));
});

//对dist目录下的所有js文件进行压缩
gulp.task('js-min', ['copy-file-to-dist'], function() {
    return gulp.src(['./dist/**/*.js'])
        .pipe(jsmin())
        .pipe(gulp.dest('./dist/'))
})

//对dist目录下的所有css文件里面的引用的（img）添加md5值
gulp.task('css-rev', ['js-min'], function() {
    return gulp.src(['./dist/**/*.css'])
        .pipe(cssmin())
        .pipe(assetRev())
        .pipe(gulp.dest('./dist/'));
});

//对dist目录下的所有html文件里面的引用的（css, img, js）添加md5值
gulp.task('html-rev', ['css-rev'], function() {
    return gulp.src(['./dist/**/*.html'])
        .pipe(htmlmin(options))
        .pipe(assetRev())
        .pipe(gulp.dest('./dist/'));
});

//gulp任务主入口
gulp.task('build', ['html-rev']);


//auto refresh pages when you modify assets

gulp.task('browser-sync', function() {
    browserSync.init({
        server: { baseDir: "./" }
    });
});

gulp.task('watch', function() {
    gulp.watch([
        './html/**/*.html',
        './css/*.css',
        './js/**/*.js'
    ], browserSync.reload);
});

gulp.task('dev', ['browser-sync', 'watch']);

//compress dest file to zip
gulp.task('clean-zip', function() {
    gulp.src(['./*.zip'])
        .pipe(clean());
});

gulp.task('build-zip', ['clean-zip'], function() {
    var curTime = new Date(),
        year = curTime.getFullYear(),
        mon = curTime.getMonth() + 1,
        day = curTime.getDate(),
        hour = curTime.getHours(),
        min = curTime.getMinutes(),
        sec = curTime.getSeconds(),
        prefix = (...args) => args.map(item => item < 10 ? `0${item}` : item),
        rev = year + prefix(mon, day, hour, min, sec).join("");

    gulp.src(['./dist/**'])
        .pipe(zip(rev + '.zip'))
        .pipe(gulp.dest("./"))
})

gulp.task('zip', ['build-zip'])

//minify image by gulp plugin
var gulpPngquant = require('gulp-pngquant'), // use pngquant to compress png
    imgMin = require('gulp-image'); //compress all kinds of photos but my computer doesn't work

gulp.task('jpg-min', function() {
    gulp.src("./img/*.jpg")
        .pipe(imgMin())
        .pipe(gulp.dest('img/min-img'));
})


gulp.task("png-min", ['jpg-min'], function() {
    gulp.src('./img/*.png')
        .pipe(gulpPngquant({
            quality: '65-75'
        }))
        .pipe(gulp.dest('./img/min-img'));
})

gulp.task('imgMin', ["png-min"])