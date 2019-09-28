import { watch, promises as fs } from "fs";
import path from "path";

import { INPUT_DIR } from "./dev-config.mjs";
import { refreshBrowser } from "./dev-server.mjs";
import { startServer } from "./dev-server.mjs";

const watcher = (event, fileName) => {
  console.log(event, fileName);
  refreshBrowser();
};

const watchFile = path => watch(path, watcher);
const watchDir = dir =>
  fs
    .readdir(dir)
    .then(files =>
      Promise.all(
        files
          .map(file => path.join(dir, file))
          .map(path =>
            fs
              .stat(path)
              .then(stats =>
                stats.isDirectory() ? watchDir(path) : watchFile(path)
              )
          )
      )
    );

watchDir(INPUT_DIR).then(() => startServer());
