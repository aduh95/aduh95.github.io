const gulp = require('gulp');
const util = require('gulp-util');
const fs = require('fs');
const DataURI = require('datauri');

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

const exec = require('child_process').exec;
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

const JSON_FILES = FRONT_ROOT+"json/*.json";
const PHP_SRC = PROJECT_ROOT+"/src/*/*.php";

const NPM_ROOT = PROJECT_ROOT+"/node_modules/";
const FONT_ROOT = NPM_ROOT+"font-awesome/fonts/";
const FONT_FILES = [
    "fontawesome-webfont.woff2",
    "fontawesome-webfont.woff",
    "fontawesome-webfont.ttf"
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
        return FONT_ROOT+cv;
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
    gulp.src(DEST+"*.min.*", { read: false })
        .pipe(rm());
});
gulp.task("uglify", ["clean-uglify", "sass", "vendor_dependencies", "typescript"], function () {
    gulp.src([DEST + "global.js"])
        .pipe(uglify())
        .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest(DEST));

    gulp.src(DEST + "global.css")
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

    gulp.watch([JSON_FILES, PHP_SRC])
        .on("change", changeHandler)
        .on("change", function (event) {livereload.reload(event.path)});

	gulp.watch("composer.lock", ["composer-install"])
	  .on("change", changeHandler);

	gulp.watch("composer.json", ["composer-update"])
	  .on("change", changeHandler);
});

gulp.task('default', ['connect','sass','vendor_dependencies','typescript','watch']);

gulp.task("init", function () {
	composer("create-project");
});

gulp.task("one-file", function () {
    exec('php public/index.php --one-file', {maxBuffer: 500<<10}, function (err, stdout, stderr) {
        if (err) {
            errorHandler(err);
            console.log(stderr);
        } else {
            (new DataURI()).encode(FONT_ROOT + FONT_FILES[1], (err, content) => {
                if (err) {
                    errorHandler(err);
                } else {
                    fs.writeFile(
                        require("path").join(__dirname, PROJECT_ROOT + "/index.html"),
                        stdout.replace(
                            /<!--style:(.+)-->/,
                            (match, $1) => {
                                // embeding CSS and Font Awesome
                                return "<style>"+fs.readFileSync($1).toString()
                                .replace('url(../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0) format("embedded-opentype"),url(../fonts/fontawesome-webfont.woff2?v=4.7.0) format("woff2"),', '')
                                .replace(',url(../fonts/fontawesome-webfont.ttf?v=4.7.0) format("truetype"),url(../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular) format("svg")', '')
                                .replace(
                                    '../fonts/fontawesome-webfont.woff?v=4.7.0',
                                    content
                                )+"</style>";
                            }
                        ),
                        function () {
                          console.log("Done");
                        }
                    );
                }
            });
        }
    });
})