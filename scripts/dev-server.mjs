import path from "path";

import getRenderedHTML from "./dev-build-html.mjs";
import getRenderedJS from "./dev-build-js.mjs";
import getRuntimeScripts from "./getRuntimeScripts.mjs";
import ts2js from "./ts2js.mjs";

import {
  __dirname,
  AUTO_REFRESH_MODULE,
  BUNDLE_NAME,
  INPUT_DIR,
  PORT_NUMBER,
} from "./dev-config.mjs";

const INDEX_FILE = path.join(INPUT_DIR, "index.html");
const connections = new Set();

const createServer = express => {
  const app = express();

  app.get("/", (_, res) => {
    res.header("Content-Type", "text/html");
    getRenderedHTML(INDEX_FILE)
      .then(html => res.send(html))
      .catch(e => {
        console.error(e);
        res
          .status(503)
          .send(
            "<script type=module src='" +
              AUTO_REFRESH_MODULE +
              "'></script><p>Rendering failed</p>"
          );
      });
  });
  app.get("/originalIndexFile", (_, res) => {
    res.sendFile(INDEX_FILE);
  });

  app.get(`/${AUTO_REFRESH_MODULE}`, (_, res) =>
    res.sendFile(path.join(__dirname, AUTO_REFRESH_MODULE))
  );
  app.get(`/manifest.json`, (_, res) =>
    res.sendFile(path.join(__dirname, "..", "manifest.json"))
  );
  app.get(`/${BUNDLE_NAME}`, (_, res) => {
    res.header("Content-Type", "application/javascript");
    getRenderedJS()
      .then(({ output }) => res.send(output[0].code))
      .catch(e => {
        console.error(e);
        res.sendStatus(503);
      });
  });

  getRuntimeScripts()
    .then(scripts =>
      scripts.map(([url, path]) => {
        app.get(url, (_, res) => {
          res.header("Content-Type", "application/javascript");

          ts2js(path)
            .then(outputText => res.send(outputText))
            .catch(e => {
              console.error(e);
              res.sendStatus(503);
            });
        });
      })
    )
    .catch(console.error);
  app.use(express.static(INPUT_DIR));

  return app;
};

export const startServer = () =>
  Promise.all([import("express"), import("ws")])
    .then(_ => _.map(module => module.default))
    .then(([express, { Server }]) => {
      const server = createServer(express).listen(
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
