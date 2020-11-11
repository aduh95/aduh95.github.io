import { promises as fs, existsSync } from "fs";
import { pathToFileURL } from "url";

import {
  internalProperty,
  autoImportIdentifierStrictRegEx,
  importStatementStrictRegEx,
} from "./rollup-plugin-toml.mjs";

const getPrologComment = (tomlFilePath) => `/**
* Auto generated file to use TOML file with TypeScript.
* @see ${pathToFileURL(tomlFilePath)}
*/
`;

function getCompactedJSONType(data) {
  if (!Array.isArray(data)) throw new Error("Expected an array");

  if (
    data.every(
      (e) =>
        typeof e === "object" &&
        !Array.isArray(e) &&
        !e.__use_generic_keys_for_current_scope__
    )
  ) {
    const dataKeys = data.map(Object.keys);
    const allKeys = new Set(dataKeys.flat());
    let tDsRepresentation = `{\n\t`;
    for (const key of allKeys) {
      const concerned = [];
      let optional = "";
      dataKeys.forEach((keys, i) => {
        if (keys.includes(key)) concerned.push(data[i][key]);
        else optional = "?";
      });

      tDsRepresentation += `${key}${optional}:${getCompactedJSONType(concerned)
        .replace(/\[\]$/, "")
        .replace(/^Array\<(.*)\>$/ms, "$1")},\n\t`;
    }
    tDsRepresentation += `\n}[]`;
    return tDsRepresentation;
  } else return getJSONType(data);
}

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
  } else if (data.__use_generic_keys_for_current_scope__) {
    const interfaces = new Set(
      Object.entries(data)
        .filter(([key]) => !internalProperty.test(key))
        .map(([_, entry]) => getJSONType(entry))
    );
    return `{ [${data.__use_generic_keys_for_current_scope__}: string]: ${[
      ...interfaces,
    ].join("|")} }`;
  } else {
    return `{\n\t${Object.entries(data)
      .map(([key, value]) => `${JSON.stringify(key)}: ${getJSONType(value)}`)
      .join(";\n\t")}\n}`;
  }
}

function expendSubInterfaces(data, subInterfaces) {
  const interfaces = Object.keys(subInterfaces);
  for (const [key, entry] of Object.entries(data)) {
    if (typeof entry !== "object") {
    } else if (interfaces.includes(key)) {
      entry["__use_generic_keys_for_current_scope__"] = subInterfaces[key];
    } else {
      expendSubInterfaces(entry, subInterfaces);
    }
  }
}

const createDummyJSFile = (tomlFile) =>
  fs.writeFile(tomlFile + ".js", getPrologComment(tomlFile));

export function generateDTs({ data, exportableKeys, isArray, imports }) {
  if ("__use_generic_keys__" in data) {
    expendSubInterfaces(data, data.__use_generic_keys__);
  }
  if ("__use_generic_keys_for_current_scope__" in data) {
    exportableKeys = [];
  }
  const dTs = isArray
    ? `declare const exports: ${getCompactedJSONType(
        isArray
      )};\nexport default exports;`
    : exportableKeys
        .map((key) => `export const ${key}: ${getJSONType(data[key])}`)
        .join(";\n") +
      "\ndeclare const exports: " +
      getJSONType(data) +
      ";\nexport default exports;\n";
  const importStatements = imports.length
    ? `${imports.join(
        ";\n"
      )};\n\ntype AutoImport = \n\t| ${imports
        .map((importStatement) =>
          importStatement.replace(
            importStatementStrictRegEx,
            (_, $1) => `typeof ${$1}`
          )
        )
        .join("\n\t| ")};\n\n`
    : "";
  return importStatements + dTs;
}

const dTsCache = new Map();
export async function updateTSInteropFiles(path, tomlKeys) {
  if (!existsSync(path + ".js")) {
    await createDummyJSFile(path);
  }
  const dTs = generateDTs(tomlKeys);
  if (dTsCache.get(path) !== dTs) {
    await fs.writeFile(path + ".d.ts", getPrologComment(path) + dTs);
    dTsCache.set(path, dTs);
  }
}
