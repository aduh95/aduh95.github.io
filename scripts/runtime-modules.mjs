import { promises as fs } from "fs";
import path from "path";

import { INPUT_DIR } from "./dev-config.mjs";

const RUNTIME_MODULES_DIR_NAME = "runtime";
const TS_EXTENSION = /\.tsx?$/;

export default () =>
  fs
    .readdir(path.join(INPUT_DIR, RUNTIME_MODULES_DIR_NAME))
    .then((files) =>
      files
        .filter((fileName) => TS_EXTENSION.test(fileName))
        .map((fileName) => [
          `/${RUNTIME_MODULES_DIR_NAME}/${fileName.replace(
            TS_EXTENSION,
            ".js"
          )}`,
          path.join(INPUT_DIR, RUNTIME_MODULES_DIR_NAME, fileName),
        ])
    );
