import { promises as fs } from "fs";
import path from "path";

const RUNTIME_SCRIPTS_DIR_NAME = "runtime";

const getRuntimeScripts = OUTPUT_DIR =>
  fs
    .readdir(path.join(OUTPUT_DIR, RUNTIME_SCRIPTS_DIR_NAME))
    .then(files =>
      files
        .filter(fileName => fileName.endsWith(".js"))
        .map(fileName => `./${RUNTIME_SCRIPTS_DIR_NAME}/${fileName}`)
    );

export default getRuntimeScripts;
