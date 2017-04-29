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

const mainBowerFiles = require('main-bower-files');
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

const DEST = PROJECT_ROOT + '/public/dist/';
const VENDOR_FONTS = DEST + 'fonts/';


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
        base: PROJECT_ROOT + "/src",
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
            target: "ES5"
        }).on("error", errorHandler))
        .pipe(gulp.dest(DEST))
        .pipe(livereload());
});

gulp.task('cms-typescript', function () {
    return gulp.src([TS_CMS, TS_DEF])
        .pipe(ts({
            noImplicitAny: false,
            out: 'global.js'
        }).on("error", errorHandler))
        .pipe(gulp.dest(DEST_CMS))
        .pipe(livereload());
});

gulp.task('cms-sass', function () {
    return gulp.src(SASS_CMS)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', errorHandler))
        .pipe(autoprefixer())
        .pipe(gulp.dest(DEST_CMS))
        .pipe(livereload());
});

gulp.task("cms", ["cms-typescript", "cms-sass"]);
gulp.task("uglify-cms", function () {
	gulp.src([DEST_CMS + "global.js"])
		.pipe(uglify())
		.pipe(gulp.dest(DEST_CMS));

	gulp.src(DEST_CMS + "global.css")
		.pipe(uglifycss())
		.pipe(gulp.dest(DEST));
});

gulp.task('vendorjs', function() {
    let vendorFiles = mainBowerFiles();
    let JSfiles = vendorFiles.filter(function (name) {
            return name.endsWith(".js");
        });
    let CSSFiles = vendorFiles.filter(function (name) {
            return name.endsWith(".css");
        });
    let fontFiles = vendorFiles.filter(function (name) {
            return name.endsWith(".ttf") ||name.endsWith(".woff") ||name.endsWith(".woff2") ||name.endsWith(".otf");
        });

    gulp.src(JSfiles)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(DEST));
    gulp.src(CSSFiles)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(DEST));

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

gulp.task('default', ['connect','sass','vendorjs','typescript','watch']);

gulp.task("init", function () {
	composer("create-project");
});

gulp.task("production", ["sass", "vendorjs", "typescript", "cms"], function () {
	composer({
		"no-dev": true,
        "optimize-autoloader": true
	});
    gulp.start("uglify");
	gulp.start("uglify-cms");
})
