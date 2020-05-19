import TOML from "@aduh95/toml";
import { updateTSInteropFiles } from "./dev-build-toml-d-ts.mjs";

const reservedNames = [
  "instanceof",
  "typeof",
  "break",
  "do",
  "new",
  "var",
  "case",
  "else",
  "return",
  "void",
  "catch",
  "finally",
  "continue",
  "for",
  "switch",
  "while",
  "this",
  "with",
  "debugger",
  "function",
  "throw",
  "default",
  "if",
  "try",
  "delete",
  "in",
];
const validIdentifierName = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
export const internalProperty = /^__\w+__$/;
export const autoImportQuotedIdentifier = /"(__auto_import__\d+)"/g;
export const autoImportIdentifierStrictRegEx = /^__auto_import__\d+$/;
export const importStatementStrictRegEx = /^.+as (__auto_import__\d+).+$/;

function* getImports(data, autoImports) {
  for (const [key, value] of Object.entries(data)) {
    if (autoImports.includes(key)) {
      data[key] = yield value;
    } else if (typeof value === "object") {
      yield* getImports(value, autoImports);
    }
  }
}

export function getTOMLKeys(toml) {
  const data = TOML.parse(toml);

  const imports = [];
  if ("__auto_imports__" in data) {
    let id = 0;
    let result;
    let replacementValue;
    const iterator = getImports(data, data.__auto_imports__);
    while ((result = iterator.next(replacementValue)) && !result.done) {
      const [module, importIdentifier] = result.value.split(":");
      replacementValue = `__auto_import__${id++}`;
      imports.push(
        `import {${importIdentifier} as ${replacementValue}} from ${JSON.stringify(
          module
        )}`
      );
    }
  }

  const keys = Object.keys(data).filter((key) => !internalProperty.test(key));

  if (keys.length === 1 && keys[0] === "item" && Array.isArray(data.item)) {
    return { data, imports, isArray: data.item };
  }

  const exportableKeys = [];
  const nonExportableKeys = [];
  for (const key of keys) {
    if (!reservedNames.includes(key) && validIdentifierName.test(key)) {
      exportableKeys.push(key);
    } else {
      nonExportableKeys.push(key);
    }
  }
  return { data, exportableKeys, nonExportableKeys, imports };
}

export default function plugin() {
  return {
    name: "toml",
    resolveId(source) {
      // This signals that rollup should not ask other plugins or check the file
      // system to find this id.
      return source.endsWith(".toml") ? source : null;
    },
    transform(code, id) {
      if (!id.endsWith(".toml")) {
        return null;
      }
      const {
        data,
        exportableKeys,
        nonExportableKeys,
        isArray,
        imports,
      } = getTOMLKeys(code);
      code = isArray
        ? `export default ${JSON.stringify(isArray)}`
        : exportableKeys
            .map((key) => `export const ${key} = ${JSON.stringify(data[key])}`)
            .join(";") +
          `;export default{${exportableKeys.join(",")}, ${nonExportableKeys
            .map((key) => `${JSON.stringify(key)}:${JSON.stringify(data[key])}`)
            .join(",")}}`;

      if (imports.length) {
        code =
          imports.join(";") +
          ";" +
          code.replace(
            autoImportQuotedIdentifier,
            (_, identifier) => identifier
          );
      }

      // This should come last because it mutates the data object.
      updateTSInteropFiles(id, {
        data,
        exportableKeys,
        nonExportableKeys,
        isArray,
        imports,
      }).catch(console.error);

      return { code, map: { mappings: "" } };
    },
  };
}
