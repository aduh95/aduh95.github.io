import { watch, promises as fs } from "fs";
import path from "path";

import { INPUT_DIR } from "./dev-config.mjs";
import { sendRebuildSignal } from "./dev-build-js-from-worker.mjs";
import { refreshBrowser } from "./dev-server.mjs";
import { startServer } from "./dev-server.mjs";

let antiRebound;
const watcher = (event, fileName) => {
  console.log(event, fileName);
  if (antiRebound !== fileName) {
    sendRebuildSignal(fileName);
    antiRebound = fileName;
    setTimeout(() => {
      if (antiRebound === fileName) antiRebound = null;
    }, 5000);
    refreshBrowser();
  }
};

const watchFile = (path) => watch(path, watcher);
const watchDir = (dir) =>
  fs.readdir(dir).then((files) =>
    Promise.all(
      files
        .filter(
          (fileName) =>
            !fileName.endsWith(".toml.d.ts") && !fileName.endsWith(".toml.js")
        )
        .map((file) => path.join(dir, file))
        .map((path) =>
          fs
            .stat(path)
            .then((stats) =>
              stats.isDirectory() ? watchDir(path) : watchFile(path)
            )
        )
    )
  );

watchDir(INPUT_DIR)
  .then(() => startServer())
  .catch(console.error);
