var gulp = require('gulp'),
    clean = require('gulp-clean'),
    assetRev = require('gulp-asset-rev');

//清空dist目录
gulp.task('clear-dist-dir', function() {
    return gulp.src(['./dist'])
        .pipe(clean());
});

//拷贝项目所有源文件到dist目录下，并排除node_modules, gulpfile.js, package.json, README.md这些目录和文件
gulp.task('copy-file-to-dist', ['clear-dist-dir'], function() {
    return gulp.src(['./**/*.*', '!./node_modules/**/*.*', '!./gulpfile.js', '!./package.json', '!./README.md'])
        .pipe(gulp.dest('./dist'));
});

//对dist目录下的所有css文件里面的引用的（img）添加md5值
gulp.task('css-rev', ['copy-file-to-dist'], function() {
    return gulp.src(['./dist/**/*.css'])
        .pipe(assetRev())
        .pipe(gulp.dest('./dist/'));
});

//对dist目录下的所有html文件里面的引用的（css, img, js）添加md5值
gulp.task('html-rev', ['css-rev'], function() {
    return gulp.src(['./dist/**/*.html'])
        .pipe(assetRev())
        .pipe(gulp.dest('./dist/'));
});

//gulp任务主入口
gulp.task('build', ['html-rev']);