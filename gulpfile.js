var electron = require('electron-connect').server.create();
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var gulpPlugin = require('gulp-load-plugins')(); // gulp-xxx插件集合
var babel = gulpPlugin.babel;
var clean = gulpPlugin.clean;
var watch = gulpPlugin.watch;
var sass = gulpPlugin.sass;
var cssmin = gulpPlugin.cssmin; // css压缩
var uglify = gulpPlugin.uglify; // js压缩
var rename = gulpPlugin.rename;

var ROOT_PATH = path.resolve(__dirname);

var PUBLIC_PATH = path.resolve(ROOT_PATH, 'public');
var JS_PATH = path.resolve(ROOT_PATH, 'public/js');
var CSS_PATH = path.resolve(ROOT_PATH, 'public/css');
var IMAGE_PATH = path.resolve(ROOT_PATH, 'public/img');
var SERVER_PATH = path.resolve(ROOT_PATH, 'src');
var TEMPLATE_PATH = path.resolve(ROOT_PATH, 'templates');

function buildCSS() {
    var compassImporter = function(url, prev, done) {
        if (!/^compass/.test(url)) {
            return done({ file: url });
        }

        done({ file: 'compass-mixins/lib/' + url });
    };
    return gulp.src([CSS_PATH + '/**/*.css', CSS_PATH + '/**/*.scss'], { base: PUBLIC_PATH })
        .pipe(sass({
            outputStyle: 'compressed',
            importer: compassImporter,
            includePaths: [ 'node_modules' ],
            data: '@import "compass"; .transition { @include transition(all); }'
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(gulp.dest('dist'));
}

function buildJS() {
    return gulp.src(JS_PATH + '/**/*.js', { base: PUBLIC_PATH })
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
}

function buildSRC() {
    return gulp.src(SERVER_PATH + '/**/*.js', { base: SERVER_PATH })
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('libs'));
}



function judgeDir(uri) {
    if (!fs.existsSync(path.resolve(__dirname, './views'))) {
        return fs.mkdirSync(path.resolve(__dirname, './views' + (uri ? '/' + uri : '')));
    }
}

function handleTemplate(uri) {
    let tpl = path.resolve(__dirname, './templates/' + (uri.dirname == '.' ? '' : uri.dirname + '/') + uri.basename + '' + uri.extname);
    let view = path.resolve(__dirname, './views/' + (uri.dirname == '.' ? '' : uri.dirname + '/') + uri.basename + '' + uri.extname);

    judgeDir(uri.dirname == '.' ? '' : uri.dirname);

    const compile = require('./libs/swig/core.js');
    return compile(tpl, view);
}

function buildHTML() {
    return gulp.src(TEMPLATE_PATH + '/**/*.*', { base: TEMPLATE_PATH })
        .pipe(rename(function (path) {
            handleTemplate(path)
            return path;
        }));
}

function buildIMG() {
    return gulp.src(IMAGE_PATH + '/**/*.*', { base: PUBLIC_PATH })
        .pipe(gulp.dest('dist'));
}

function webReload(path, callback) {
    watch(path, function () {
        typeof callback == 'function' && callback();
        electron.reload();
    });
}

gulp.task('clean', function () {
    var opts = {
        read: false,
        allowEmpty: true
    };
    return gulp.src(['./libs', './dist', './views'], opts)
        .pipe(clean());
});

gulp.task('src', gulp.series('clean', function bs() {
    return buildSRC();
}));

gulp.task('js', function () {
    return buildJS();
});

gulp.task('img', function () {
    return buildIMG();
});

gulp.task('css', function () {
    return buildCSS();
});

gulp.task('html', gulp.series('src', function bh() {
    return buildHTML();
}));

gulp.task('build', gulp.series('src', gulp.parallel('js', 'img', 'css', 'html')));

gulp.task('watch', function () {
    webReload(CSS_PATH, buildCSS);
    webReload(IMAGE_PATH, buildIMG);
    webReload(JS_PATH, buildJS);
});

gulp.task('start', function () {
    electron.start();
})

gulp.task('dev', function () {
    webReload(SERVER_PATH, buildSRC);
    webReload(CSS_PATH, buildCSS);
    webReload(IMAGE_PATH, buildIMG);
    webReload(JS_PATH, buildJS);
    webReload(TEMPLATE_PATH, buildHTML);
    webReload(path.resolve(ROOT_PATH, 'gulpfile.js'), electron.reload);
    
    electron.start();
});
