var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var runSequence = require("run-sequence");
var rimraf = require("rimraf");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('less/main.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('css/main.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('js/main.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy.vendor', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('vendor/font-awesome'))
})

// Run everything
gulp.task('default', ['less', 'minify-css', 'minify-js', 'copy.vendor']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});

// Build Production code
gulp.task('clean.prod', function(done) {
    rimraf("dist/", done);
});

gulp.task('copy.html', function() {
    return gulp.src("*.html")
        .pipe(gulp.dest("dist/"));
});

gulp.task('copy.js', function() {
    return gulp.src("js/main.min.js")
        .pipe(gulp.dest("dist/js/"));
});

gulp.task('copy.css', function() {
    return gulp.src("css/main.min.css")
        .pipe(gulp.dest("dist/css"));
});

gulp.task('copy.images', function() {
    return gulp.src("img/**/*.*")
        .pipe(gulp.dest("dist/img"));
});

gulp.task('copy.bootstrap', function() {
    return gulp.src("vendor/bootstrap/**/*.*")
        .pipe(gulp.dest("dist/vendor/bootstrap/"));
});

gulp.task('clean.bootstrap', function(done) {
    rimraf("dist/vendor/*bootstrap/js/bootstrap.js", done);
});

gulp.task('clean.bootstrap', function(done) {
    rimraf("dist/vendor/*bootstrap/css/bootstrap.css", done);
});

gulp.task('copy.font-awesome-css', function() {
    return gulp.src("vendor/font-awesome/css/font-awesome.min.css")
        .pipe(gulp.dest("dist/vendor/font-awesome/css/"));
});

gulp.task('copy.font-awesome-fonts', function() {
    return gulp.src('node_modules/font-awesome/fonts/**')
        .pipe(gulp.dest('dist/vendor/font-awesome/fonts'))
});

gulp.task('copy.jquery', function() {
    return gulp.src("vendor/jquery/jquery.min.js")
        .pipe(gulp.dest("dist/vendor/jquery/"));
});

gulp.task('build.prod', function(done){
    runSequence(
        'clean.prod',
        'copy.html',
        'copy.js',
        'copy.css',
        'copy.images',
        'copy.bootstrap',
        'clean.bootstrap',
        'copy.font-awesome-css',
        'copy.font-awesome-fonts',
        'copy.jquery',
        done);
});

// Compiles SCSS files from /scss into /css
// NOTE: This theme uses LESS by default. To swtich to SCSS you will need to update this gulpfile by changing the 'less' tasks to run 'sass'!
gulp.task('sass', function() {
    return gulp.src('scss/agency.scss')
        .pipe(sass())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});
