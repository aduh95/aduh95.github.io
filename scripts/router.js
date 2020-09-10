import path from "path";

import getRenderedHTML from "./dev-build-html.mjs";
import getRenderedJS from "./dev-build-js-from-worker.mjs";
import ts2js from "./ts2js.mjs";

import {
  __dirname,
  AUTO_REFRESH_MODULE,
  BUNDLE_NAME,
  INPUT_DIR,
  PROJECT_DIR,
} from "./dev-config.mjs";

const INDEX_FILE = path.join(INPUT_DIR, "index.html");

const showErrorOnBrowser = function (errorMessage) {
  const d = document.createElement("dialog");
  const h = document.createElement("h2");
  h.append("TypeScript error");
  const p = document.createElement("code");
  p.style.whiteSpace = "pre-wrap";
  p.style.border = "1px solid";
  p.style.display = "block";
  p.style.padding = ".5em";
  p.style.backgroundColor = "lightgray";
  p.append(errorMessage);
  d.append(h, p, "See console for more details.");
  document.body.append(d);
  d.showModal();
};

// Loading list of client side modules to make url resolution faster
const runtimeModules = import("./runtime-modules.mjs").then((module) =>
  module.default()
);
export default async function router(req, res) {
  switch (req.url) {
    case "/":
      res.setHeader("Content-Type", "text/html");
      return process.env.NODE_ENV === "production"
        ? res.end("Disabled on production server.")
        : getRenderedHTML(INDEX_FILE)
            .then((html) => res.end(html))
            .catch((e) => {
              console.error(e);
              res.statusCode = 500;
              res.end(
                "<script type=module src='" +
                  AUTO_REFRESH_MODULE +
                  "'></script><p>Rendering failed</p>"
              );
            });

    case `/${AUTO_REFRESH_MODULE}`:
      res.setHeader("Content-Type", "application/javascript");
      return import("fs")
        .then(({ createReadStream }) =>
          createReadStream(path.join(__dirname, AUTO_REFRESH_MODULE)).pipe(res)
        )
        .catch((e) => {
          console.error(e);
          res.statusCode = 500;
          res.end();
        });

    case `/${BUNDLE_NAME}`:
      res.setHeader("Content-Type", "application/javascript");
      return getRenderedJS()
        .then(({ output }) => {
          const [{ code, map }] = output;
          res.write(code);

          // Appends Source map to help debugging
          delete map.sourcesContent;
          res.write("\n//# sourceMappingURL=data:application/json,");
          res.end(encodeURI(JSON.stringify(map)));
        })
        .catch((e) => {
          console.error(e);
          res.statusCode = 206;
          res.end(
            `(${showErrorOnBrowser.toString()})(${JSON.stringify(e.message)})`
          );
        });

    default:
      const script = (await runtimeModules).find(([url]) => url === req.url);
      if (script) {
        res.setHeader("Content-Type", "application/javascript");
        ts2js(script[1])
          .then((outputText) => res.end(outputText))
          .catch((e) => {
            console.error(e);
            res.statusCode = 206;
            res.end(
              `(${showErrorOnBrowser.toString()})(${JSON.stringify(e.message)})`
            );
          });
      } else {
        const resolvedPath = path.join(PROJECT_DIR, req.url);
        import("fs")
          .then(({ promises, constants, createReadStream }) =>
            promises.access(resolvedPath, constants.R_OK).then(() => {
              createReadStream(resolvedPath).pipe(res);
            })
          )

          .catch((e) => {
            console.error(e);
            res.statusCode = 404;
            res.end(`Cannot find '${req.url}' on this server.`);
          });
      }
  }
}
