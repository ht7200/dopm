/**
 * Created by zt425_000 on 2016/6/12.
 */
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),//css压缩
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    jshint = require('gulp-jshint'),//js检测
    notify = require('gulp-notify');//提示信息

gulp.task('cleanCss', function() {
    return del(['dest/css']);
});

gulp.task('css', ['cleanCss'], function() {

    return gulp.src('src/css/sdk.less')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(less())
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dest/css/'));
    
    // return gulp.src('src/css/*.css')
    //     .pipe(notify({ message: 'css task start' }))
    //     .pipe(concat('main.css'))
    //     // .pipe(gulp.dest('dest/css'))
    //     .pipe(rename({ suffix: '.min' }))
    //     .pipe(minifycss())
    //     .pipe(gulp.dest('dest/css'))
    //     .pipe(notify({ message: 'css task ok' }));
});


gulp.task('cleanJs', function() {
    return del([ 'dest/js']);
});

gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(notify({ message: 'lint task ok' }));
});

gulp.task('jsDev', ['cleanJs', 'lint'], function() {
    return gulp.src(['src/js/lib/zepto.min.js', 'src/js/lib/iscroll.js', 'src/js/lib/stomp.js', 'src/js/lib/sdk.js',
        'src/js/conf/conf_develop.js',
        'src/js/*.js'])
        .pipe(concat('sdk.js'))
        // .pipe(gulp.dest('dest/js'))
        //.pipe(uglify())
        .pipe(rename({ suffix: '.dev' }))
        .pipe(gulp.dest('dest/js'))
        .pipe(notify({ message: 'jsDev task ok' }));
});

gulp.task('jsRelease', ['cleanJs', 'lint'], function() {
    return gulp.src(['src/js/lib/zepto.min.js', 'src/js/lib/iscroll.js', 'src/js/lib/stomp.js', 'src/js/lib/sdk.js',
            'src/js/conf/conf_release.js',
            'src/js/*.js'])
        .pipe(concat('sdk.js'))
        // .pipe(gulp.dest('dest/js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dest/js'))
        .pipe(notify({ message: 'jsRelease task ok' }));
});

gulp.task('default', ['css', 'jsDev', 'jsRelease'],function(){

    // Watch .css files
    gulp.watch('src/css/*.less', ['css']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks [css]');
    });

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['jsDev','jsRelease']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks [jsDev,jsRelease]');
    });
});