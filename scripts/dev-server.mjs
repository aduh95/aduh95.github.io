import getRenderedHTML from "./dev-build-html.mjs";
import getRenderedJS from "./dev-build-js.mjs";

import path from "path";
import {
  __dirname,
  AUTO_REFRESH_MODULE,
  BUNDLE_NAME,
  OUTPUT_DIR,
} from "./dev-config.mjs";

const PORT_NUMBER = 8080;
const connections = new Set();

const createServer = express => {
  const app = express();

  app.get("/", (_, res) => {
    res.header("Content-Type", "text/html");
    getRenderedHTML()
      .then(html => res.send(html))
      .catch(e => {
        console.error(e);
        res
          .status(503)
          .send(
            "<script type=module src='" +
              AUTO_REFRESH_MODULE +
              "'></script><p>No markdown modified</p>"
          );
      });
  });

  app.get(`/${AUTO_REFRESH_MODULE}`, (_, res) =>
    res.sendFile(path.join(__dirname, AUTO_REFRESH_MODULE))
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
  app.use(express.static(OUTPUT_DIR));

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
