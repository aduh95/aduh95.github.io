import path from "path";

import getRenderedHTML from "./dev-build-html.mjs";
import getRenderedJS from "./dev-build-js.mjs";
import ts2js from "./ts2js.mjs";

import {
  __dirname,
  AUTO_REFRESH_MODULE,
  BUNDLE_NAME,
  INPUT_DIR,
  PORT_NUMBER,
  PROJECT_DIR,
} from "./dev-config.mjs";

const INDEX_FILE = path.join(INPUT_DIR, "index.html");
const connections = new Set();

const showErrorOnBrowser = function(errorMessage) {
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

const runtimeScripts = import("./getRuntimeScripts.mjs").then(module =>
  module.default()
);
const requestListener = async (req, res) => {
  switch (req.url) {
    case "/":
      res.setHeader("Content-Type", "text/html");
      return getRenderedHTML(INDEX_FILE)
        .then(html => res.end(html))
        .catch(e => {
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
      return import("fs").then(({ createReadStream }) =>
        createReadStream(path.join(__dirname, AUTO_REFRESH_MODULE)).pipe(res)
      );

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
        .catch(e => {
          console.error(e);
          res.statusCode = 206;
          res.end(
            `(${showErrorOnBrowser.toString()})(${JSON.stringify(e.message)})`
          );
        });

    default:
      const script = (await runtimeScripts).find(([url]) => url === req.url);
      if (script) {
        res.setHeader("Content-Type", "application/javascript");
        ts2js(script[1])
          .then(outputText => res.end(outputText))
          .catch(e => {
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

          .catch(e => {
            console.error(e);
            res.statusCode = 404;
            res.end(`Cannot find '${req.url}' on this server.`);
          });
      }
  }
};

export const startServer = () =>
  Promise.all([import("http"), import("ws")])
    .then(_ => _.map(module => module.default))
    .then(([{ createServer }, { Server }]) => {
      const server = createServer(requestListener).listen(
        PORT_NUMBER,
        "localhost",
        function() {
          console.log(`Server started on http://localhost:${PORT_NUMBER}`);
        }
      );

      new Server({ server }).on("connection", connection => {
        connections.add(connection);

        connection.ping(1);
      });

      return server;
    });

export const refreshBrowser = () => {
  const OPEN = 1;
  for (const wsConnection of connections) {
    if (wsConnection.readyState === OPEN) {
      console.log("Sending socket to refresh browser");
      wsConnection.send("refresh");
    }
  }
  return true;
};
