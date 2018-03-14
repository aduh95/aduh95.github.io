import gulp from "gulp";
import fs from "fs";
import path from "path";

import DataURI from "datauri";

import sassCompiler from "gulp-sass";
import ts from "gulp-typescript";

import PHPServer from "gulp-connect-php";
import livereload from "gulp-livereload";
import notify from "gulp-notify";

import uglify from "gulp-uglify";
import uglify_es from "uglify-es";
import uglify_composer from "gulp-uglify/composer";
// import uglifycss from "gulp-cssnano";
import purifycss from "purify-css";

import composer from "gulp-composer";
import autoprefixer from "gulp-autoprefixer";
import rm from "gulp-rm";
import rename from "gulp-rename";
import concat from "gulp-concat";

import { exec } from "child_process";

const uglifyES6 = uglify_composer(uglify_es, console);
const uglifyOptions = {
  mangle: { toplevel: true },
  warnings: true,
  compress: {
    drop_console: true,
  },
};

const PROJECT_ROOT = path.resolve(__dirname);
const PUBLIC_ROOT = path.join(PROJECT_ROOT, "public");
const FRONT_ROOT = path.join(PROJECT_ROOT, "front");

const SASS_SRC = path.join(FRONT_ROOT, "sass", "**", "*.scss");
const TS_SRC = path.join(FRONT_ROOT, "ts", "*.ts");
const TS_SW = path.join(PUBLIC_ROOT, "sw.ts");
const TS_DEF = path.join(
  PROJECT_ROOT,
  "node_modules",
  "@types",
  "**",
  "*.d.ts"
);

const JSON_FILES = path.join(FRONT_ROOT, "json", "*.json");
const PHP_SRC = path.join(PROJECT_ROOT, "src", "*", "*.php");

const NPM_ROOT = path.join(PROJECT_ROOT, "node_modules");
const FONT_ROOT = path.join(NPM_ROOT, "font-awesome", "fonts");
const FONT_FILES = [
  "fontawesome-webfont.woff2",
  "fontawesome-webfont.woff",
  "fontawesome-webfont.ttf",
];

const DEST = path.join(PUBLIC_ROOT, "dist");
const VENDOR_FONTS = path.join(PUBLIC_ROOT, "fonts");

var errorHandler = function(error) {
  if (!error.diagnostic || !error.diagnostic.messageText) {
    error.diagnostic = { messageText: error.message };
  }
  if (notify.onError) {
    notify.onError({
      title: "Gulp",
      subtitle: "Failure!",
      message: "Error: <%= error.diagnostic.messageText %>",
      sound: "Beep",
    })(error);

    console.log("Notify " + error.name);
  }
};

var changeHandler = function(filepath) {
  console.log("File " + filepath + " was modified, running tasks...");
};

export function connect(done) {
  PHPServer.server({
    port: 8080,
    base: path.join(PROJECT_ROOT, "public"),
    livereload: true,
  });

  done();
}

export const sass = () =>
  gulp
    .src(SASS_SRC)
    .pipe(sassCompiler().on("error", errorHandler))
    .pipe(autoprefixer({ browsers: "> 1%" }))
    .pipe(gulp.dest(DEST))
    .pipe(livereload());

export const typescript = () =>
  gulp
    .src([TS_SRC, TS_DEF])
    .pipe(
      ts({
        noImplicitAny: true,
        out: "global.js",
        lib: ["es2017", "dom"],
        target: "ES5",
      }).on("error", errorHandler)
    )
    .pipe(gulp.dest(DEST))
    .pipe(livereload());

export const serviceWorker = () =>
  gulp
    .src([TS_SW, TS_DEF])
    .pipe(
      ts({
        noImplicitAny: true,
        out: "sw.js",
        target: "ES6",
      }).on("error", errorHandler)
    )
    .pipe(uglifyES6(uglifyOptions))
    .pipe(gulp.dest(PROJECT_ROOT))
    .pipe(livereload());

export function vendor_dependencies(done) {
  let vendorFiles = [];
  let JSfiles = vendorFiles.filter(name => name.endsWith(".js"));
  let fontFiles = FONT_FILES.map(cv => path.join(FONT_ROOT, cv));

  fontFiles.forEach(function(fontFile) {
    gulp.src(fontFile).pipe(gulp.dest(VENDOR_FONTS));
  });

  done();
}

const frontCompile = gulp.parallel(
  sass,
  vendor_dependencies,
  typescript,
  serviceWorker
);

export const cleanMinify = () =>
  gulp.src(DEST + path.sep + "*.min.*", { read: false }).pipe(rm());

export const minify = gulp.series(
  gulp.parallel(cleanMinify, frontCompile),
  gulp.parallel(
    () =>
      gulp
        .src(path.join(DEST, "global.js"))
        .pipe(uglify(uglifyOptions))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(DEST)),
    () =>
      gulp
        .src(path.join(DEST, "global.css"))
        // .pipe(uglifycss())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(DEST))
  )
);

export const composerInstall = done => done(composer());
export const composerUpdate = done => done(composer("update"));

export const watch = () => {
  livereload.listen();

  gulp.watch(SASS_SRC, sass).on("change", changeHandler);
  gulp.watch([TS_SRC, TS_DEF], typescript).on("change", changeHandler);
  gulp.watch(TS_SW, serviceWorker).on("change", changeHandler);
  gulp
    .watch([JSON_FILES, PHP_SRC])
    .on("change", changeHandler)
    .on("change", function(event) {
      livereload.reload(event.path);
    });
  gulp.watch("composer.lock", composerInstall).on("change", changeHandler);
  gulp.watch("composer.json", composerUpdate).on("change", changeHandler);
};

export const oneFile = gulp.series(minify, function(done) {
  console.info("Generating HTML...");
  exec("php public/index.php --one-file", { maxBuffer: 500 << 10 }, function(
    err,
    stdout,
    stderr
  ) {
    if (err) {
      errorHandler(err);
      console.log(stderr);
    } else {
      console.info("Success!");

      let cssLicenses = "";
      const inlineCSS = (css, woff) => (match, $1) =>
        "<style>" +
        purifycss(
          stdout,
          css.toString().replace(/\/\*\!(\n.+)+\*\//g, match => {
            cssLicenses += match.replace("/*!", "\n").replace("*/", "") + "\n";
            return "";
          }),
          {
            minify: true,
            info: true,
            rejected: false,
          }
        )
          .replace(/\n/g, "")
          .replace(
            'url(../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0) format("embedded-opentype"),url(../fonts/fontawesome-webfont.woff2?v=4.7.0) format("woff2"),',
            ""
          )
          .replace(
            ',url(../fonts/fontawesome-webfont.ttf?v=4.7.0) format("truetype"),url(../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular) format("svg")',
            ""
          )
          .replace("../fonts/fontawesome-webfont.woff?v=4.7.0", woff) +
        "</style>";

      console.log("Reading CSS");
      const cssFileTag = /<!--style:(.+)-->/;
      fs.readFile(stdout.match(cssFileTag)[1], (err, css) => {
        if (err) return errorHandler(err);
        console.info("Purifying css...");

        console.info("Embeding font file...");
        new DataURI().encode(
          path.join(FONT_ROOT, FONT_FILES[1]),
          (err, dataURI) => {
            if (err) {
              errorHandler(err);
            } else {
              console.info("Success!");
              fs.writeFile(
                path.join(PROJECT_ROOT, "index.html"),
                stdout
                  .replace(cssFileTag, inlineCSS(css, dataURI))
                  .replace("*Please see the attached CSS file*", cssLicenses),
                function() {
                  console.log("Done");
                  done();
                }
              );
            }
          }
        );
      });
    }
  });
});

gulp.task("one-file", oneFile);

export const init = done => done(composer("create-project"));

export const build = gulp.parallel(connect, frontCompile, watch);
export default build;
