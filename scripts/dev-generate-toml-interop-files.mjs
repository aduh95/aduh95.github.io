import { promises as fs, constants } from "fs";
import path from "path";

import { DATA_DIR } from "./dev-config.mjs";
import { updateTSInteropFiles } from "./dev-build-toml-module.mjs";
import { getTOMLKeys } from "./rollup-plugin-toml.mjs";

const getTOMLKeysFromFileDescriptor = (fd) =>
  fd.readFile("utf8").then(getTOMLKeys);

async function createInteropFilesFromTOMLFile(tomlFile) {
  if (!tomlFile.endsWith(".toml")) {
    return;
  }
  const fullPath = path.join(DATA_DIR, tomlFile);
  try {
    const fd = await fs.open(fullPath, constants.R_OK);
    const tomlKeys = await getTOMLKeysFromFileDescriptor(fd)
      .catch((message) => {
        const error = new Error(message);
        error.fileName = fullPath;
        return Promise.reject(error);
      })
      .finally(() => fd.close());
    return updateTSInteropFiles(fullPath, tomlKeys);
  } catch (e) {
    console.error(e);
  }
}

export const createAllTOMLInteropFiles = () =>
  fs
    .readdir(DATA_DIR)
    .then((files) => Promise.all(files.map(createInteropFilesFromTOMLFile)))
    .catch(console.error);

createAllTOMLInteropFiles();
