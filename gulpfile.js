const gulp = require('gulp');
const util = require('gulp-util');

const sass = require('gulp-sass');
const ts = require('gulp-typescript');

try {
    var connect = require('gulp-connect-php');
    var livereload = require('gulp-livereload');
    var notify = require('gulp-notify');
} catch (err) {
    var livereload = util.noop, notify = util.noop, connect = util.noop;
}

const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-cssnano');

const concat = require('gulp-concat');
const rm = require( 'gulp-rm' );
const rename = require( 'gulp-rename' );

const composer = require('gulp-composer');
const git = require("gulp-git");

const PROJECT_ROOT = '.';
const FRONT_ROOT = PROJECT_ROOT + '/front/';

const SASS_SRC = FRONT_ROOT + '/sass/**/*.scss';
const TS_SRC   = FRONT_ROOT + '/ts/*.ts';
const TS_DEF = PROJECT_ROOT + '/typings/**/*.d.ts';

const FONT_FILES = [
    "font-awesome/fonts/fontawesome-webfont.woff2",
    "font-awesome/fonts/fontawesome-webfont.woff",
    "font-awesome/fonts/fontawesome-webfont.ttf"
];

const DEST = PROJECT_ROOT + '/public/dist/';
const VENDOR_FONTS = DEST + '../fonts/';


var errorHandler = function (error) {
    if (!error.diagnostic || !error.diagnostic.messageText) {
        error.diagnostic = {messageText: error.message};
    }
    if (notify.onError) {
        notify.onError({
                    title:    "Gulp",
                    subtitle: "Failure!",
                    message:  "Error: <%= error.diagnostic.messageText %>",
                    sound:    "Beep"
                })(error);

        console.log("Notify "+error.name);
    }
}


gulp.task('connect', function() {
    connect.server({
        port: 8080,
        base: PROJECT_ROOT + "/public",
        livereload: true
    });
});

gulp.task('sass', function () {
	return gulp.src(SASS_SRC)
		.pipe(sass().on('error', errorHandler))
		.pipe(autoprefixer({browsers:"> 1%"}))
		.pipe(gulp.dest(DEST))
		.pipe(livereload());
});

gulp.task('sass:watch', function () {
  gulp.watch(SASS_SRC, ['sass']);
});

gulp.task('typescript', function () {
    return gulp.src([TS_SRC, TS_DEF])
        .pipe(ts({
            noImplicitAny: true,
            out: 'global.js',
            lib: ["es2017", "dom"],
            target: "ES5"
        }).on("error", errorHandler))
        .pipe(gulp.dest(DEST))
        .pipe(livereload());
});

gulp.task('vendor_dependencies', function() {
    let vendorFiles = [];
    let JSfiles = vendorFiles.filter(function (name) {
            return name.endsWith(".js");
        });
    let fontFiles = FONT_FILES.map(function (cv) {
        return PROJECT_ROOT+"/node_modules/"+cv;
    });

    // gulp.src(JSfiles)
    //     .pipe(concat('vendor.js'))
    //     .pipe(gulp.dest(DEST));

    fontFiles.forEach(function (fontFile) {
        gulp.src(fontFile)
            .pipe(gulp.dest(VENDOR_FONTS));
    });

});

gulp.task("clean-uglify", function () {
    gulp.src(DEST+"concat.**", { read: false })
        .pipe(rm());
});
gulp.task("uglify", ["clean-uglify"], function () {
    gulp.src([DEST + "vendor.js", DEST + "global.js"])
        .pipe(concat("concat.js"))
        .pipe(gulp.dest(DEST))
        .pipe(uglify())
        .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest(DEST));

    gulp.src(DEST + "*.css")
        .pipe(concat("concat.css"))
        .pipe(gulp.dest(DEST))
        .pipe(uglifycss())
        .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest(DEST));
});

gulp.task("composer-install", function () {
	composer();
});

gulp.task("composer-update", function () {
	composer("update");
});


var changeHandler =  function(event) { console.log('File ' + event.path + ' was ' + event.type + ', running tasks...'); };

gulp.task('watch', function(){

	livereload.listen();

	gulp.watch(SASS_SRC, ['sass'])
	  .on('change', changeHandler);

	gulp.watch([TS_SRC,TS_DEF], ['typescript'])
	  .on('change', changeHandler);

	gulp.watch("composer.lock", ["composer-install"])
	  .on("change", changeHandler);

	gulp.watch("composer.json", ["composer-update"])
	  .on("change", changeHandler);
});

gulp.task('default', ['connect','sass','vendor_dependencies','typescript','watch']);

gulp.task("init", function () {
	composer("create-project");
});

gulp.task("production", ["sass", "vendor_dependencies", "typescript", "cms"], function () {
	composer({
		"no-dev": true,
        "optimize-autoloader": true
	});
    gulp.start("uglify");
	gulp.start("uglify-cms");
})
