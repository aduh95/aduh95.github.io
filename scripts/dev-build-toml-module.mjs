import { promises as fs, existsSync, constants } from "fs";
import path from "path";

import { DATA_DIR } from "./dev-config.mjs";
import {
  getTOMLKeys,
  internalProperty,
  autoImportIdentifierStrictRegEx,
  importStatementStrictRegEx,
} from "./rollup-plugin-toml.mjs";

function getJSONType(data) {
  const type = typeof data;
  if (type === "string" && autoImportIdentifierStrictRegEx.test(data)) {
    return "AutoImport";
  } else if (type !== "object") {
    return type;
  } else if (data === null) {
    return "null";
  } else if (Array.isArray(data)) {
    const types = new Set(data.map(getJSONType));
    if (types.size === 1) {
      return types.values().next().value + "[]";
    } else {
      return `Array<${[...types].join("|")}>`;
    }
  } else if (data.__interface__) {
    const interfaces = new Set(
      Object.entries(data)
        .filter(([key]) => !internalProperty.test(key))
        .map(([_, entry]) => getJSONType(entry))
    );
    return `{ [${data.__interface__}: string]: ${[...interfaces].join("|")}}`;
  } else {
    return `{${Object.entries(data)
      .map(([key, value]) => `${JSON.stringify(key)}: ${getJSONType(value)}`)
      .join(";")}}`;
  }
}

function expendSubInterfaces(data, subInterfaces) {
  const interfaces = Object.keys(subInterfaces);
  for (const [key, entry] of Object.entries(data)) {
    if (typeof entry !== "object") {
    } else if (interfaces.includes(key)) {
      entry["__interface__"] = subInterfaces[key];
    } else {
      expendSubInterfaces(entry, subInterfaces);
    }
  }
}

export function toml2dTs(fd) {
  return fd.readFile("utf8").then((toml) => {
    const { data, exportableKeys, isArray, imports } = getTOMLKeys(toml);
    if ("__subinterfaces__" in data) {
      expendSubInterfaces(data, data.__subinterfaces__);
    }
    let dTs = isArray
      ? `declare const exports: ${getJSONType(
          isArray
        )};\nexport default exports;`
      : exportableKeys
          .map((key) => `export const ${key}: ${getJSONType(data[key])}`)
          .join(";\n") +
        ";\ninterface toml " +
        getJSONType(data) +
        "\ndeclare const exports: toml;\nexport default exports;";
    if (imports.length) {
      dTs =
        `${imports.join(
          ";\n"
        )};\ntype AutoImport = ${imports
          .map((importStatement) =>
            importStatement.replace(
              importStatementStrictRegEx,
              (_, $1) => `typeof ${$1}`
            )
          )
          .join("|")};\n` + dTs;
    }
    return dTs;
  });
}

const createDummyFile = (tomlFile) =>
  fs.writeFile(tomlFile + ".js", "// Dummy file for TypeScript compiler.");

export async function tomlTSInterop(tomlFile) {
  if (!tomlFile.endsWith(".toml")) {
    return;
  }
  const fullPath = path.join(DATA_DIR, tomlFile);
  try {
    const fd = await fs.open(fullPath, constants.R_OK);
    if (!existsSync(fullPath + ".js")) {
      await createDummyFile(fullPath);
    }
    const dTs = await toml2dTs(fd)
      .catch((message) => {
        const error = new Error(message);
        error.fileName = fullPath;
        return Promise.reject(error);
      })
      .finally(() => fd.close());
    return fs.writeFile(fullPath + ".d.ts", dTs);
  } catch (e) {
    console.error(e);
  }
}

fs.readdir(DATA_DIR)
  .then((files) => Promise.all(files.map(tomlTSInterop)))
  .catch(console.error);
