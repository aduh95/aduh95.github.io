import { toml2json } from "@aduh95/toml2json";

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

export function getTOMLKeys(toml) {
  const data = JSON.parse(toml2json(toml));
  const keys = Object.keys(data).filter((key) => !internalProperty.test(key));

  if (keys.length === 1 && keys[0] === "item" && Array.isArray(data.item)) {
    return { data: data.item, isArray: true };
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
  return { data, exportableKeys, nonExportableKeys };
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
      const { data, exportableKeys, nonExportableKeys, isArray } = getTOMLKeys(
        code
      );
      code = isArray
        ? `export default ${JSON.stringify(data)}`
        : exportableKeys
            .map((key) => `export const ${key} = ${JSON.stringify(data[key])}`)
            .join(";") +
          `;export default{${exportableKeys.join(",")}, ${nonExportableKeys
            .map((key) => `${JSON.stringify(key)}:${JSON.stringify(data[key])}`)
            .join(",")}}`;

      return { code, map: { mappings: "" } };
    },
  };
}
